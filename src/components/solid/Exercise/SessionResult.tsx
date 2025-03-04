import { getPracticeSessionResults } from "@services/practice";
import type { GrammarPoint } from "grammar-sdk";
import { Example as ExampleImpl } from "grammar-sdk/example";
import { For, Show } from "solid-js";
import type { SessionResult as SessionResultType } from "space-repetition/session";
import { Card, CardContent, CardHeader } from "ui/card";
import { Example } from "../example/Example";

export const SessionResult = (props: {
  sessionResult?: SessionResultType;
  grammar: GrammarPoint[];
}) => {
  const sessionResult = () =>
    props.sessionResult ?? getPracticeSessionResults();

  const answers = () =>
    sessionResult()?.attempts?.map?.((attempt) => {
      const gp = props.grammar.find((gp) => gp.id === attempt.grammarPointId);
      const example = gp?.examples.find((e) => e.order === attempt.stage);
      return {
        ...example,
        ru: example?.ru
          ? ExampleImpl.replaceAnswer(example.ru, attempt.answer)
          : undefined,
        isCorrect: attempt.isCorrect,
        grammarPointId: attempt.grammarPointId,
      };
    }) as {
      ru: ExampleImpl;
      en: ExampleImpl;
      isCorrect: boolean;
      grammarPointId: string;
    }[];

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
