import { cva } from "class-variance-authority";
import type { JSX } from "solid-js";
import { children } from "solid-js";
import { cn } from "~/lib/utils";

const variants = cva(
  "block h-[40px] w-[40px] cursor-pointer hover:text-primary/60",
  {
    variants: {
      variant: {
        primary: "fill-primary",
        secondary: "fill-secondary",
      },
    },
  },
);

export const IconButton = (props: {
  onClick?: () => void;
  href?: string;
  variant?: "primary" | "secondary";
  disabled?: boolean;
  children?: JSX.Element;
  class?: string;
  type?: "button" | "submit" | "reset";
}) => {
  const c = children(() => props.children);
  const className = () => cn(variants({ variant: props.variant }), props.class);
  return (
    <button
      type={props.type ?? "button"}
      onClick={props.onClick}
      disabled={props.disabled}
      class={className()}
    >
      {props.href ? <a href={props.href}>{c()}</a> : <div>{c()}</div>}
    </button>
  );
};
