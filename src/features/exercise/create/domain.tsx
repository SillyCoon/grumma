import { createStore } from "solid-js/store";
import { makePersisted } from "@solid-primitives/storage";
import type {
  AcceptableAnswer,
  Exercise,
  ExercisePart,
} from "grammar-sdk/exercise";

export const EmptyExercisePart = (order: number): ExercisePart => ({
  type: "text",
  text: "",
  index: order,
});

const addEmptyPart = (
  parts: Exercise["parts"] | Exercise["translationParts"],
) => {
  if (parts.length >= 3) return parts;
  if (parts.length < 2) throw new Error("Exercise must have at least 2 parts");
  const newParts = () => {
    if (parts[0]?.type === "answer") {
      return [EmptyExercisePart(0), ...parts];
    }
    return [...parts, EmptyExercisePart(parts.length)];
  };
  return newParts().map((part, index) => ({ ...part, index }));
};

const padLeftRight = (exercise: Exercise): Exercise => {
  return {
    ...exercise,
    parts: addEmptyPart(exercise.parts),
    translationParts: addEmptyPart(exercise.translationParts),
  };
};

export const exercisesStore = (
  grammarPointId: number,
  initialExercises: Exercise[],
) => {
  const key = `exercises-${grammarPointId}`;

  const [exercises, setExercises] = makePersisted(
    createStore<Exercise[]>(initialExercises.map(padLeftRight)),
    { name: key },
  );

  const addAcceptableAnswer = (exerciseIndex: number, answerIndex: number) => {
    setExercises(exerciseIndex, "parts", answerIndex, (part) => {
      if (part.type !== "answer") return part;
      return {
        ...part,
        acceptableAnswers: [
          ...(part.acceptableAnswers || []),
          { text: "", variant: "correct" as const },
        ],
      };
    });
  };

  const updateAcceptableAnswer = (
    updates: Partial<AcceptableAnswer>,
    exerciseIndex: number,
    answerIndex: number,
    acceptableAnswerIndex: number,
  ) => {
    setExercises(exerciseIndex, "parts", answerIndex, (part) => {
      if (part.type !== "answer") return part;
      return {
        ...part,
        acceptableAnswers: part.acceptableAnswers?.map((ans, idx) =>
          idx === acceptableAnswerIndex ? { ...ans, ...updates } : ans,
        ),
      };
    });
  };

  const getAnswer = (exerciseIndex: number, answerIndex: number) => {
    const part = exercises[exerciseIndex].parts[answerIndex];
    if (part.type !== "answer") {
      throw new Error("Part is not an answer");
    }
    return part;
  };

  return {
    exercises,
    setExercises,
    clear: () => localStorage.removeItem(key),
    addAcceptableAnswer,
    updateAcceptableAnswer,
    toggleHideExercise: (index: number) =>
      setExercises(index, "hide", (prev) => !prev),
    getAnswer,
  };
};
