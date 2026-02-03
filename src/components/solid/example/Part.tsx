import { cva } from "class-variance-authority";
import type { Example } from "grammar-sdk/example";

type Props = { part: Example; variant?: "neutral" | "correct" | "wrong" };

const variants = cva("", {
  variants: {
    variant: {
      neutral: "text-secondary",
      correct: "text-success",
      wrong: "text-error",
    },
  },
  defaultVariants: {
    variant: "neutral",
  },
});

export const Part = (props: Props) => {
  return (
    <p class="text-center text-lg md:text-xl">
      {props.part[0].trim()}{" "}
      <span class={variants({ variant: props.variant })}>
        {props.part[1].trim()}
      </span>
      {""}
      {props.part[2].trim()}
    </p>
  );
};
