import { children } from "solid-js";
import type { JSX } from "solid-js";
import { cn } from "~/lib/utils";

export const IconButton = (props: {
  onClick?: () => void;
  variant?: "primary" | "secondary";
  disabled?: boolean;
  children?: JSX.Element;
  class?: string;
}) => {
  const c = children(() => props.children);
  return (
    <button type="button" onClick={props.onClick} disabled={props.disabled}>
      <div
        class={cn(
          "h-[40px] w-[40px] cursor-pointer hover:text-primary/60",
          `fill-${props.variant}`,
          props.class,
        )}
      >
        {c()}
      </div>
    </button>
  );
};
