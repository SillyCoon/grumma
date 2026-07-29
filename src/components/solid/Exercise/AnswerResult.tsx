import { cva } from "class-variance-authority";
import type { AnswerVariant } from "grammar-sdk";
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
  variant?: AnswerVariant;
  description?: string;
  correctAnswer: string;
}) => {
  const variantClass = () => variants({ variant: props.variant });

  return (
    <p class={variantClass()} aria-live="polite">
      <Switch
        fallback={
          <span class="text-center font-semibold text-lg text-success">🤔</span>
        }
      >
        <Match when={props.variant === "correct"}>
          ✅ {props.description ?? props.correctAnswer}
        </Match>
        <Match when={props.variant === "incorrect"}>
          ❌ {props.description ? `${props.description} ` : ""}Correct answer:{" "}
          {props.correctAnswer}
        </Match>
        <Match when={props.variant === "try-again"}>
          ⚠️ {props.description ?? "You're close, try again!"}
        </Match>
      </Switch>
    </p>
  );
};
