import { createEffect, splitProps, type JSX } from "solid-js";
import { transliterate } from "src/utils";
import { cn } from "~/lib/utils";

export const TransliterateInput = (
  props: Omit<
    JSX.InputHTMLAttributes<HTMLInputElement>,
    "type" | "onInput" | "value"
  > & {
    clear: boolean;
    onInput: (str: string) => void;
  },
) => {
  let ref!: HTMLInputElement;
  const [{ onInput }, p] = splitProps(props, ["onInput"]);

  createEffect(() => {
    if (props.clear) {
      ref.value = "";
    }
  });

  return (
    <input
      ref={ref}
      {...p}
      class={cn(p.class, "text-center")}
      type="text"
      onInput={(e) => {
        onInput(transliterate(e.target.value));
      }}
    />
  );
};
