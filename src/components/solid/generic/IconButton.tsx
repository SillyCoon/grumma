import { children } from "solid-js";
import type { JSX } from "solid-js";

export const IconButton = (props: {
  onClick?: () => void;
  variant?: "primary" | "secondary";
  disabled?: boolean;
  children?: JSX.Element;
}) => {
  const c = children(() => props.children);
  return (
    <button type="button" onClick={props.onClick} disabled={props.disabled}>
      <div
        class={`h-[40px] w-[40px] cursor-pointer fill-${props.variant ?? "primary"} hover:text-primary/60`}
      >
        {c()}
      </div>
    </button>
  );
};
