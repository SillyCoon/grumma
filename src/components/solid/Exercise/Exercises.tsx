import { clearPracticeSession, saveAttempt } from "@services/sr";
import { navigate } from "astro:transitions/client";
import type { Exercise as ExerciseType } from "grammar-sdk";
import { Match, Switch, createEffect, createSignal, onMount } from "solid-js";
import type { Stage } from "space-repetition";
import { Spinner } from "ui/Spinner";
import { simpleShuffle } from "utils/array";
import { v4 as uuidv4 } from "uuid";
import { Exercise } from "./Exercise";

export const Exercises = (props: {
  exercises: ExerciseType[];
  type: "sr" | "practice";
}) => {
  const [exercisesLeft, setExercisesLeft] = createSignal<ExerciseType[]>(
    simpleShuffle(props.exercises),
  );

  const exercise = () => exercisesLeft().at(0);

  const isSr = () => props.type === "sr";

  const sessionId = isSr() ? uuidv4() : "practice";

  onMount(() => {
    !isSr() && clearPracticeSession();
  });

  const handleNext = (
    completed: ExerciseType,
    result: { answer: string; correct: boolean },
  ) => {
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

    setExercisesLeft((left) =>
      result.correct
        ? left.filter((l) => l !== completed)
        : simpleShuffle(left),
    );
  };

  createEffect(() => {
    if (!exercise()) {
      navigate(`/sr/review/${sessionId}/result`);
    }
  });

  return (
    <Switch fallback={<Spinner />}>
      <Match when={exercise()}>
        <Exercise
          exercise={exercise() as ExerciseType}
          handleNext={handleNext}
        />
      </Match>
    </Switch>
  );
};
