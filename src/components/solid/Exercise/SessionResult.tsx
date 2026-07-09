import type {
  ExercisesByGrammarPointId,
  Exercise as ExerciseType,
} from "grammar-sdk/exercise";
import { Example as ExampleImpl } from "grammar-sdk/example";
import type { SessionResult as SessionResultType } from "space-repetition/session";
import { calculateExerciseOrderByStage } from "packages/space-repetition/src/SpaceRepetition";
import { CommonSessionResult } from "./CommonSessionResults";

export const SessionResult = (props: {
  sessionResult: SessionResultType;
  exercises: ExercisesByGrammarPointId;
}) => {
  const answers = () => {
    const session = props.sessionResult;
    if (!session) return [];

    return session.attempts
      .map((attempt) => {
        const exercises = props.exercises[attempt.grammarPointId];
        if (!exercises) {
          console.warn(
            `Exercises for grammar point with id ${attempt.grammarPointId} not found`,
          );
          return undefined;
        }

        // TODO: session result should return the example, so we don't have to calculate the order and replace the answer on the client
        const order = calculateExerciseOrderByStage(
          exercises.length,
          attempt.stage,
        );
        const exercise: ExerciseType | undefined = exercises.find(
          (e) => e.order === order,
        );
        if (!exercise) {
          console.warn(
            `Exercise with order ${order} not found for grammar point ${attempt.grammarPointId}`,
          );
          return undefined;
        }

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
      .filter(
        (answer) =>
          answer !== undefined &&
          answer.ru !== undefined &&
          answer.en !== undefined,
      ) as {
      ru: ExampleImpl;
      en: ExampleImpl;
      isCorrect: boolean;
      grammarPointId: string;
    }[];
  };

  return (
    <CommonSessionResult
      answers={answers()}
      sessionResult={props.sessionResult}
    />
  );
};
