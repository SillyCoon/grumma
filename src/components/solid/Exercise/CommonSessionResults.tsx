import type { Example as ExampleImpl } from "grammar-sdk/example";
import { For, Show } from "solid-js";
import { Card, CardContent, CardHeader } from "ui/card";
import { Example } from "../example/Example";
import type { AnySessionResult } from "packages/space-repetition/src/session";

export const CommonSessionResult = ({
  answers,
  sessionResult,
}: {
  answers: {
    ru: ExampleImpl;
    en: ExampleImpl;
    isCorrect: boolean;
    grammarPointId: string;
  }[];
  sessionResult?: AnySessionResult;
}) => {
  const backTo = () => `/sr/review/${sessionResult?.sessionId}/result`;
  const grammarHref = (gpId: string) => `/grammar/${gpId}?backTo=${backTo()}`;

  return (
    <Show when={sessionResult}>
      {(sessionResult) => (
        <div>
          <h1 class="mb-5 text-center text-3xl">Молодец!</h1>

          <div class="grid grid-cols-1 gap-5 md:grid-cols-4">
            <Accuracy
              total={sessionResult().total}
              correct={sessionResult().correct}
            />
            <div class="flex flex-col gap-3 md:col-span-3">
              <For each={answers}>
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
          {props.total > 0
            ? Math.floor((props.correct / props.total) * 100)
            : 0}
          %
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
