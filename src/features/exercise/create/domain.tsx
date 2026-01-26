import { createStore } from "solid-js/store";
import type { AcceptableAnswer, Exercise } from "../domain";

export const exercisesStore = (initialExercises: Exercise[]) => {
  const [exercises, setExercises] = createStore<Exercise[]>(initialExercises);

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
    addAcceptableAnswer,
    updateAcceptableAnswer,
    deleteExercise: (index: number) =>
      setExercises((e) => e.filter((_, i) => i !== index)),
    getAnswer,
  };
};
