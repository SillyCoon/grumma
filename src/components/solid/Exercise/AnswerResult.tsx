import { Match, Switch } from "solid-js";

export const AnswerResult = (props: {
  isCorrect: boolean | undefined;
  correctAnswer: string;
}) => {
  return (
    <Switch
      fallback={
        <div class="text-center font-semibold text-lg text-success">🤔</div>
      }
    >
      <Match when={props.isCorrect === true}>
        <p class="text-center font-semibold text-lg text-success">
          ✅ {props.correctAnswer}
        </p>
      </Match>
      <Match when={props.isCorrect === false}>
        <p class="text-center font-semibold text-error text-lg">
          ❌ {props.correctAnswer}
        </p>
      </Match>
    </Switch>
  );
};
