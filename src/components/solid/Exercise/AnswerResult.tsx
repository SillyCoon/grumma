import { Match, Switch } from "solid-js";

export const AnswerResult = (props: {
  isCorrect: boolean | undefined;
  correctAnswer: string;
}) => {
  return (
    <Switch fallback={null}>
      <Match when={props.isCorrect === true}>
        <p class="mt-2 text-center text-green-500 text-sm">Correct!</p>
      </Match>
      <Match when={props.isCorrect === false}>
        <p class="mt-2 text-center text-red-500 text-sm">{`Incorrect :( Correct is ${props.correctAnswer}`}</p>
      </Match>
    </Switch>
  );
};
