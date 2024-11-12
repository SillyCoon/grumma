import { saveAttempt } from "@services/sr";
import { Match, Switch, createSignal } from "solid-js";
import type { Stage } from "src/server/feature/space-repetition/types/Stage";
import { v4 as uuidv4 } from "uuid";
import type { Exercise as ExerciseType } from "@grammar-sdk";
import { simpleShuffle } from "../../../utils";
import { Exercise } from "./Exercise";

export const Exercises = (props: { exercises: ExerciseType[] }) => {
  const sessionId = uuidv4();

  const [exercisesLeft, setExercisesLeft] = createSignal<ExerciseType[]>(
    simpleShuffle(props.exercises),
  );

  const [wrong, setWrong] = createSignal<Set<ExerciseType>>(new Set());

  const exercise = () => exercisesLeft().at(0);

  const handleNext = (
    completed: ExerciseType,
    result: { answer: string; correct: boolean },
  ) => {
    if (window.location.pathname.includes("sr")) {
      const e = exercise();
      if (e) {
        saveAttempt({
          answer: result.answer,
          isCorrect: result.correct,
          answeredAt: new Date(),
          grammarPointId: e.grammarPointId,
          reviewSessionId: sessionId,
          // TODO: this will work only if amount of exercises is the same as the amount of stages
          stage: (exercise()?.order ?? 1) as Stage,
        });
      }
    }

    if (result.correct) {
      setExercisesLeft((left) => left.filter((l) => l !== completed));
    } else {
      setWrong((wrong) => wrong.add(completed));
      setExercisesLeft((left) => simpleShuffle(left));
    }
  };

  return (
    <Switch
      fallback={
        <>
          <p class="text-center text-3xl font-bold text-secondary mt-8">
            That's all folks!
          </p>
          <p>
            Result: {props.exercises.length - wrong().size} /{" "}
            {props.exercises.length}
          </p>
        </>
      }
    >
      <Match when={exercise()}>
        <Exercise
          exercise={exercise() as ExerciseType}
          handleNext={handleNext}
        />
      </Match>
    </Switch>
  );
};
