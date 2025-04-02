import type { JSX } from "solid-js";
import { splitProps, type ParentProps } from "solid-js";
import { cn } from "./utils";

export const Anchor = (
  props: JSX.HTMLAttributes<HTMLAnchorElement> &
    ParentProps<{ href: string; class?: string }>,
) => {
  const [local, others] = splitProps(props, ["class"]);
  return (
    <a
      {...others}
      href={props.href}
      class={cn(
        "focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        local.class,
      )}
    >
      {props.children}
    </a>
  );
};
