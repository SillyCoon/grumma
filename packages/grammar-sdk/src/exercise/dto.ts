import type { Exercise, ExercisePart } from ".";
import type {
  acceptableAnswersTmp,
  exercisePartsTmp,
  exercisesTmp,
} from "../../../../libs/db/schema-tmp";

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

export type CreateExerciseDb = Omit<
  typeof exercisesTmp.$inferSelect,
  "id" | "createdAt" | "updatedAt"
> & {
  parts: PartToCreateDb[];
};

export type UpdateExerciseDb = CreateExerciseDb & {
  id: number;
};

export const ExerciseDb = {
  toExercise: (e: ExerciseDb): Exercise => {
    return {
      id: e.id,
      grammarPointId: e.grammarPointId.toString(),
      order: e.order,
      hide: e.hide,
      parts: e.parts
        .filter((p) => p.language === "ru")
        .toSorted((a, b) => a.order - b.order)
        .map(partFromDB),
      translationParts: e.parts
        .filter((p) => p.language === "en")
        .toSorted((a, b) => a.order - b.order)
        .map(partFromDB),
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
