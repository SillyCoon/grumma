import { type Exercise, type ExercisePart, Text } from ".";
import type {
  acceptableAnswersTmp,
  exercisePartsTmp,
  exercisesTmp,
} from "db/schema-tmp";

export type ExerciseDb = typeof exercisesTmp.$inferSelect & {
  parts: (typeof exercisePartsTmp.$inferSelect & {
    acceptableAnswers?: (typeof acceptableAnswersTmp.$inferSelect)[];
  })[];
};

export type PartToCreateDb = Omit<
  typeof exercisePartsTmp.$inferInsert,
  "id" | "createdAt" | "updatedAt" | "exerciseId"
> & {
  acceptableAnswers?: Omit<
    typeof acceptableAnswersTmp.$inferInsert,
    "id" | "createdAt" | "updatedAt" | "answerId"
  >[];
};

type CreateExerciseDb = Omit<
  typeof exercisesTmp.$inferSelect,
  "id" | "createdAt" | "updatedAt"
> & {
  parts: PartToCreateDb[];
};

type UpdateExerciseDb = CreateExerciseDb & {
  id: number;
};

export const ExercisesDb = {
  toExercises: (exercises: ExerciseDb[]): Exercise[] => {
    return exercises
      .map(ExerciseDb.toExercise)
      .toSorted((a, b) => a.order - b.order);
  },
};

export const ExerciseDb = {
  toExercise: (e: ExerciseDb): Exercise => {
    return {
      id: e.id,
      grammarPointId: e.grammarPointId.toString(),
      order: e.order,
      hide: e.hide,
      parts: partsFromDB(e.parts.filter((p) => p.language === "ru")),
      translationParts: partsFromDB(e.parts.filter((p) => p.language === "en")),
    };
  },
  fromExerciseToCreate: (exercise: Exercise): CreateExerciseDb => {
    return {
      grammarPointId: +exercise.grammarPointId,
      order: exercise.order,
      hide: exercise.hide,
      parts: [
        ...exercise.parts.map((part) => partToDb(part, "ru")),
        ...exercise.translationParts.map((part) => partToDb(part, "en")),
      ],
    };
  },
  fromExerciseToUpdate: (
    exercise: Exercise & { id: number },
  ): UpdateExerciseDb => {
    return {
      id: exercise.id,
      ...ExerciseDb.fromExerciseToCreate(exercise),
    };
  },
};

const partFromDB = (p: ExerciseDb["parts"][number]): ExercisePart => {
  if (p.type === "text") {
    return {
      id: p.id,
      index: p.order,
      type: p.type,
      text: p.text,
    };
  }
  return {
    id: p.id,
    index: p.order,
    type: p.type,
    text: p.text,
    description: p.description ?? undefined,
    acceptableAnswers:
      p.acceptableAnswers?.map((ans) => ({
        text: ans.text,
        description: ans.description ?? undefined,
        variant: ans.variant,
      })) ?? [],
  };
};

// TODO: validate parts are correct (e.g. no more than 1 answer part, at least 1 text part, etc.)
const partsFromDB = (parts: ExerciseDb["parts"]): ExercisePart[] => {
  const sorted = parts.toSorted((a, b) => a.order - b.order).map(partFromDB);
  const answerIndex = sorted.findIndex((p) => p.type === "answer");
  if (answerIndex === -1) {
    throw new Error(
      `No answer part found for exercise ${parts[0]?.exerciseId}`,
    );
  }
  if (sorted.length >= 3) return sorted;
  const padded = [...sorted];
  if (answerIndex === 0) padded.unshift(Text(0, ""));
  else padded.push(Text(0, ""));
  while (padded.length < 3) padded.push(Text(0, ""));
  return padded.map((v, i) => ({
    ...v,
    index: i,
  }));
};

const partToDb = (
  exercisePart: ExercisePart,
  language: "ru" | "en",
): PartToCreateDb => {
  return {
    order: exercisePart.index,
    type: exercisePart.type,
    text: exercisePart.text,
    description:
      "description" in exercisePart ? exercisePart.description || null : null,
    language,
    acceptableAnswers:
      "acceptableAnswers" in exercisePart
        ? exercisePart.acceptableAnswers?.map((ans) => ({
            text: ans.text,
            description: ans.description || null,
            variant: ans.variant,
          }))
        : undefined,
  };
};
