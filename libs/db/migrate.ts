import "dotenv/config";

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";
import * as tmpSchema from "./schema-tmp";

type Example = [string, string, string];
function parseExample(str: string): Example {
  const regex = /(.*)%(.*?)%(.*)/;
  const matches = new RegExp(regex).exec(str);
  if (matches) {
    return [matches[1] ?? "", matches[2] ?? "", matches[3] ?? ""];
  }
  return ["", "", ""];
}

const connectionString = process.env.DATABASE_URL ?? "";

const client = postgres(connectionString, { prepare: false });
const db = drizzle(client, { schema: tmpSchema });
const dbOld = drizzle(client, { schema });

const migrateParts = (
  parts: Example,
  exerciseId: number,
  lang: "ru" | "en",
) => {
  const partValues: {
    exerciseId: number;
    order: number;
    type: "text" | "answer";
    text: string;
    language: "ru" | "en";
  }[] = [];

  partValues.push({
    exerciseId,
    order: 0,
    type: "text",
    text: parts[0] ?? "",
    language: lang,
  });

  partValues.push({
    exerciseId,
    order: 1,
    type: "answer",
    text: parts[1] ?? "",
    language: lang,
  });

  partValues.push({
    exerciseId,
    order: 2,
    type: "text",
    text: parts[2] ?? "",
    language: lang,
  });

  return partValues;
};

async function migrate() {
  console.log("Starting migration...");

  const grammarPoints = await dbOld
    .select()
    .from(schema.grammarPoints)
    .execute();
  console.log(`Found ${grammarPoints.length} grammar points`);

  const allExercises = await dbOld.select().from(schema.exercises).execute();
  console.log(`Found ${allExercises.length} exercises`);

  const correctlyOrderedGrammarPoints = grammarPoints
    .toSorted((a, b) => a.order - b.order)
    .map((gp, i) => ({
      ...gp,
      order: i + 1,
    }));

  await db.transaction(async (tx) => {
    console.log("Migrating grammar points...");

    for (const gp of correctlyOrderedGrammarPoints) {
      await tx
        .insert(tmpSchema.grammarPointsTmp)
        .values({
          id: gp.id,
          shortTitle: gp.shortTitle,
          detailedTitle: gp.detailedTitle,
          englishTitle: gp.englishTitle,
          order: gp.order,
          structure: gp.structure,
          torfl: gp.torfl,
          hide: false,
        })
        .execute();
    }

    console.log("Migrating exercises...");

    const batchSize = 100;
    for (let i = 0; i < allExercises.length; i += batchSize) {
      const batch = allExercises.slice(i, i + batchSize);
      console.log(
        `Processing exercises ${i + 1}-${Math.min(i + batchSize, allExercises.length)}...`,
      );

      const insertedExercises = await tx
        .insert(tmpSchema.exercisesTmp)
        .values(
          batch.map((exercise) => ({
            id: exercise.id,
            grammarPointId: exercise.grammarPointId,
            order: exercise.order,
            hide: false,
          })),
        )
        .returning({
          id: tmpSchema.exercisesTmp.id,
          grammarPointId: tmpSchema.exercisesTmp.grammarPointId,
          order: tmpSchema.exercisesTmp.order,
        })
        .execute();

      const allParts: {
        exerciseId: number;
        order: number;
        type: "text" | "answer";
        text: string;
        language: "ru" | "en";
      }[] = [];

      for (const insertedExercise of insertedExercises) {
        const originalExercise = batch.find(
          (e) =>
            e.grammarPointId === insertedExercise.grammarPointId &&
            e.order === insertedExercise.order,
        );
        if (!originalExercise) continue;

        const exerciseId = insertedExercise.id;
        const ruParts = parseExample(originalExercise.ru);
        const enParts = parseExample(originalExercise.en);

        allParts.push(...migrateParts(ruParts, exerciseId, "ru"));
        allParts.push(...migrateParts(enParts, exerciseId, "en"));
      }

      const partsBatchSize = 100;
      for (let j = 0; j < allParts.length; j += partsBatchSize) {
        const partsBatch = allParts.slice(j, j + partsBatchSize);
        await tx
          .insert(tmpSchema.exercisePartsTmp)
          .values(partsBatch)
          .execute();
      }
    }

    console.log("Migration completed!");
  });

  process.exit(0);
}

migrate().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});
