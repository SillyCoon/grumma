import type { JSX } from "solid-js";
import { createEffect, createSignal, splitProps } from "solid-js";

import { cn } from "ui/utils";

type HtmlCheckboxProps = Omit<
  JSX.InputHTMLAttributes<HTMLInputElement>,
  "type"
> & {
  class?: string;
  indeterminate?: boolean;
};

const HtmlCheckbox = (props: HtmlCheckboxProps) => {
  const [local, others] = splitProps(props, [
    "class",
    "disabled",
    "indeterminate",
  ]);

  let inputRef: HTMLInputElement | undefined;

  createEffect(() => {
    if (inputRef) {
      inputRef.indeterminate = Boolean(local.indeterminate);
    }
  });

  const [checked, setChecked] = createSignal(!!props.checked);

  // HACK: solid SSR
  createEffect(() => {
    setChecked(!!props.checked);
  });

  return (
    <label
      class={cn(
        "items-top group relative inline-flex content-center items-center gap-2 space-x-2",
        local.disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer",
        local.class,
      )}
    >
      <input
        ref={(el) => {
          inputRef = el;
        }}
        type="checkbox"
        class="peer sr-only"
        checked={checked()}
        disabled={local.disabled}
        {...others}
      />

      <span
        aria-hidden="true"
        class={cn(
          "flex size-4 shrink-0 items-center justify-center rounded-sm border border-primary ring-offset-background",
          "peer-focus-visible:outline-none peer-focus-visible:ring-2 peer-focus-visible:ring-ring peer-focus-visible:ring-offset-2",
          "peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
          local.indeterminate
            ? "border-none bg-primary text-primary-foreground"
            : "peer-checked:border-none peer-checked:bg-primary peer-checked:text-primary-foreground [&>svg]:hidden peer-checked:[&>svg]:block",
        )}
      >
        {local.indeterminate ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="size-4"
          >
            <title>Indeterminate</title>
            <path d="M5 12l14 0" />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="size-4"
          >
            <title>Check</title>
            <path d="M5 12l5 5l10 -10" />
          </svg>
        )}
      </span>
      {props.children}
    </label>
  );
};

export { HtmlCheckbox };
export type { HtmlCheckboxProps };
