import { getLocalSessionResults } from "@services/practice";
import { Example as ExampleImpl } from "grammar-sdk/example";
import { createSignal, onMount } from "solid-js";
import { CommonSessionResult } from "./CommonSessionResults";

export const LocalSessionResult = () => {
  const [sessionResult, setSessionResult] = createSignal(
    getLocalSessionResults(),
  );

  onMount(() => {
    setSessionResult(getLocalSessionResults());
  });

  const answers = () => {
    const session = sessionResult();
    if (!session) return [];

    return session.attempts
      .map(({ exercise, ...attempt }) => {
        return {
          ...exercise,
          ru: exercise.parts
            ? ExampleImpl.replaceAnswer(
                ExampleImpl.fromExerciseParts(exercise.parts),
                attempt.answer,
              )
            : undefined,
          en: exercise.translationParts
            ? ExampleImpl.fromExerciseParts(exercise.translationParts)
            : undefined,
          isCorrect: attempt.isCorrect,
          grammarPointId: attempt.grammarPointId,
        };
      })
      .filter((answer) => answer !== undefined) as {
      ru: ExampleImpl;
      en: ExampleImpl;
      isCorrect: boolean;
      grammarPointId: string;
    }[];
  };
  return (
    <CommonSessionResult answers={answers()} sessionResult={sessionResult()} />
  );
};
