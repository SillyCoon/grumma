import "dotenv/config";
import { faker } from "@faker-js/faker";
import { db } from "./index";
import {
  acceptableAnswersTmp,
  exercisesTmp,
  exercisePartsTmp,
  grammarPointsTmp,
} from "./schema-tmp";

faker.seed(12345);

const grammarPointsData: (typeof grammarPointsTmp.$inferInsert)[] = [
  {
    id: 1,
    order: 1,
    shortTitle: "nominative",
    structure: "Кто? Что?",
    detailedTitle: "The Case of the Subject",
    englishTitle: "Who? What?",
    torfl: "A1",
  },
  {
    id: 2,
    order: 2,
    shortTitle: "genitive",
    structure: "Кого? Чего?",
    detailedTitle: "The Case of Possession",
    englishTitle: "Whose? Of what?",
    torfl: "A1",
  },
  {
    id: 3,
    order: 3,
    shortTitle: "dative",
    structure: "Кому? Чему?",
    detailedTitle: "The Case of Indirect Object",
    englishTitle: "To whom? To what?",
    torfl: "A2",
  },
  {
    id: 4,
    order: 4,
    shortTitle: "accusative",
    structure: "Кого? Что?",
    detailedTitle: "The Case of Direct Object",
    englishTitle: "Whom? What?",
    torfl: "A1",
  },
  {
    id: 5,
    order: 5,
    shortTitle: "instrumental",
    structure: "Кем? Чем?",
    detailedTitle: "The Case of Agent",
    englishTitle: "By whom? By what?",
    torfl: "A2",
  },
  {
    id: 6,
    order: 6,
    shortTitle: "prepositional",
    structure: "О ком? О чём?",
    detailedTitle: "The Case of Location",
    englishTitle: "About whom? About what?",
    torfl: "A1",
  },
  {
    id: 7,
    order: 7,
    shortTitle: "present-simple",
    structure: "Я делаю",
    detailedTitle: "Simple Present Actions",
    englishTitle: "I do",
    torfl: "A1",
  },
  {
    id: 8,
    order: 8,
    shortTitle: "past-simple",
    structure: "Я делал(а)",
    detailedTitle: "Simple Past Actions",
    englishTitle: "I did",
    torfl: "A1",
  },
  {
    id: 9,
    order: 9,
    shortTitle: "future-simple",
    structure: "Я буду делать",
    detailedTitle: "Simple Future Actions",
    englishTitle: "I will do",
    torfl: "A2",
  },
  {
    id: 10,
    order: 10,
    shortTitle: "aspect",
    structure: "Perfective vs Imperfective",
    detailedTitle: "Understanding Aspect in Russian",
    englishTitle: "Completed vs Ongoing Actions",
    torfl: "A2",
  },
];

const exercisesData: (typeof exercisesTmp.$inferInsert)[] = Array.from(
  { length: 40 },
  (_, i) => ({
    id: i + 1,
    grammarPointId: Math.floor(i / 4) + 1,
    order: i % 4,
  }),
);

const ruWords = [
  "кот",
  "собака",
  "дом",
  "книга",
  "стол",
  "стул",
  "окно",
  "дверь",
  "яблоко",
  "молоко",
  "хлеб",
  "вода",
  "сон",
  "день",
  "ночь",
  "год",
  "мама",
  "папа",
  "брат",
  "сестра",
  "друг",
  "учитель",
  "ученик",
];

const enWords = [
  "cat",
  "dog",
  "house",
  "book",
  "table",
  "chair",
  "window",
  "door",
  "apple",
  "milk",
  "bread",
  "water",
  "sleep",
  "day",
  "night",
  "year",
  "mother",
  "father",
  "brother",
  "sister",
  "friend",
  "teacher",
  "student",
];

const getRandomWords = (words: string[], count: number) => {
  const selected: string[] = [];
  for (let i = 0; i < count; i++) {
    selected.push(faker.helpers.arrayElement(words));
  }
  return selected.join(" ");
};

const exercisePartsData: (typeof exercisePartsTmp.$inferInsert)[] = Array.from(
  { length: 80 },
  (_, i) => {
    const exerciseIndex = i % 40;
    const isEnglish = i >= 40;
    const words = isEnglish ? enWords : ruWords;
    const wordCount = faker.number.int({ min: 1, max: 3 });

    const hasLeft = faker.datatype.boolean();
    const hasRight = !hasLeft || faker.datatype.boolean();

    const parts: (typeof exercisePartsTmp.$inferInsert)[] = [];
    let order = 0;

    if (hasLeft) {
      parts.push({
        exerciseId: exerciseIndex + 1,
        order: order++,
        type: "text",
        text: ` ${getRandomWords(words, wordCount)} `,
        language: isEnglish ? "en" : "ru",
      });
    }

    parts.push({
      exerciseId: exerciseIndex + 1,
      order: order++,
      type: "answer",
      text: ` ${getRandomWords(words, wordCount)} `,
      language: isEnglish ? "en" : "ru",
    });

    if (hasRight) {
      parts.push({
        exerciseId: exerciseIndex + 1,
        order: order++,
        type: "text",
        text: ` ${getRandomWords(words, wordCount)} `,
        language: isEnglish ? "en" : "ru",
      });
    }

    return parts;
  },
).flat();

const seed = async () => {
  try {
    console.log("🌱 Starting database seed...");
    console.log("Cleaning existing data...");
    await db.delete(acceptableAnswersTmp);
    await db.delete(exercisePartsTmp);
    await db.delete(exercisesTmp);
    await db.delete(grammarPointsTmp);
    console.log("✅ Cleaned existing data.");

    // Insert grammar points
    console.log("Inserting grammar points...");
    await db.insert(grammarPointsTmp).values(grammarPointsData);
    console.log("✅ Inserted 10 grammar points");

    // Insert exercises
    console.log("Inserting exercises...");
    await db.insert(exercisesTmp).values(exercisesData);
    console.log("✅ Inserted 40 exercises");

    // Insert exercise parts
    console.log("Inserting exercise parts...");
    const insertedParts = await db
      .insert(exercisePartsTmp)
      .values(exercisePartsData)
      .returning({
        id: exercisePartsTmp.id,
        exerciseId: exercisePartsTmp.exerciseId,
        order: exercisePartsTmp.order,
        type: exercisePartsTmp.type,
      });
    console.log(`✅ Inserted ${insertedParts.length} exercise parts`);

    // Build acceptable answers from inserted parts
    const answerParts = insertedParts.filter((p) => p.type === "answer");
    const newAcceptableAnswers: (typeof acceptableAnswersTmp.$inferInsert)[] =
      answerParts.map((p) => ({
        answerId: p.id,
        text: faker.lorem.words({ min: 2, max: 5 }),
        variant: "correct" as const,
      }));

    // Insert acceptable answers
    console.log("Inserting acceptable answers...");
    await db.insert(acceptableAnswersTmp).values(newAcceptableAnswers);
    console.log(
      `✅ Inserted ${newAcceptableAnswers.length} acceptable answers`,
    );

    console.log("Seed completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Seed failed:", error);
    process.exit(1);
  }
};

seed();
