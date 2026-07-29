import { cva } from "class-variance-authority";
import { Match, Switch } from "solid-js";

const variants = cva("text-center font-semibold text-lg", {
  variants: {
    variant: {
      correct: "text-success",
      incorrect: "text-error",
      "try-again": "text-warning",
    },
  },
});

export const AnswerResult = (props: {
  variant?: "correct" | "incorrect" | "try-again";
  description?: string;
  correctAnswer: string;
}) => {
  const variantClass = () => variants({ variant: props.variant });

  return (
    <p class={variantClass()}>
      <Switch
        fallback={
          <div class="text-center font-semibold text-lg text-success">🤔</div>
        }
      >
        <Match when={props.variant === "correct"}>
          ✅ {props.description ?? props.correctAnswer}
        </Match>
        <Match when={props.variant === "incorrect"}>
          ❌ {props.description} Correct answer: {props.correctAnswer}
        </Match>
        <Match when={props.variant === "try-again"}>
          ⚠️ {props.description ?? "You're close, try again!"}
        </Match>
      </Switch>
    </p>
  );
};
