import { getPracticeSessionResults } from "@services/practice";
import type { GrammarPoint } from "grammar-sdk";
import type { Exercise as ExerciseType } from "grammar-sdk/exercise";
import { Example as ExampleImpl } from "grammar-sdk/example";
import { For, Show } from "solid-js";
import type { SessionResult as SessionResultType } from "space-repetition/session";
import { Card, CardContent, CardHeader } from "ui/card";
import { Example } from "../example/Example";
import { calculateExerciseOrderByStage } from "packages/space-repetition/src/SpaceRepetition";

export const SessionResult = (props: {
  sessionResult?: SessionResultType;
  grammar: GrammarPoint[];
}) => {
  const sessionResult = () =>
    props.sessionResult ?? getPracticeSessionResults();

  const answers = () => {
    const session = sessionResult();
    if (!session) return [];

    return session.attempts
      .map((attempt) => {
        const gp = props.grammar.find((gp) => gp.id === attempt.grammarPointId);
        if (!gp) {
          console.warn(
            `Grammar point with id ${attempt.grammarPointId} not found`,
          );
          return undefined;
        }
        // TODO: session result should return the example, so we don't have to calculate the order and replace the answer on the client
        const order = calculateExerciseOrderByStage(
          gp.exercises.length,
          attempt.stage,
        );
        const exercise: ExerciseType | undefined = gp.exercises.find(
          (e) => e.order === order,
        );
        if (!exercise) {
          console.warn(
            `Exercise with order ${order} not found for grammar point ${gp.id}`,
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
      .filter((answer) => answer !== undefined) as {
      ru: ExampleImpl;
      en: ExampleImpl;
      isCorrect: boolean;
      grammarPointId: string;
    }[];
  };

  const backTo = () => `/sr/review/${sessionResult()?.sessionId}/result`;

  const grammarHref = (gpId: string) => `/grammar/${gpId}?backTo=${backTo()}`;

  return (
    <Show when={sessionResult()}>
      {(sessionResult) => (
        <div>
          <h1 class="mb-5 text-center text-3xl">Молодец!</h1>

          <div class="grid grid-cols-1 gap-5 md:grid-cols-4">
            <Accuracy
              total={sessionResult().total}
              correct={sessionResult().correct}
            />
            <div class="flex flex-col gap-3 md:col-span-3">
              <For each={answers()}>
                {(answer) => (
                  <Example
                    variant={answer.isCorrect ? "correct" : "wrong"}
                    ru={answer.ru}
                    en={answer.en}
                    alwaysShow
                    grammarHref={grammarHref(answer.grammarPointId)}
                  />
                )}
              </For>
            </div>
          </div>
        </div>
      )}
    </Show>
  );
};

const Accuracy = (props: {
  class?: string;
  total: number;
  correct: number;
}) => {
  return (
    <Card class="max-h-40" variant="outlined">
      <CardHeader>
        <div class="text-center text-3xl">
          {Math.floor((props.correct / props.total) * 100)}%
        </div>
      </CardHeader>
      <CardContent>
        <div class="flex flex-row justify-center gap-5">
          <div>
            Correct: <span class="text-success">{props.correct}</span>
          </div>
          <div>
            Incorrect:{" "}
            <span class="text-error">{props.total - props.correct}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
