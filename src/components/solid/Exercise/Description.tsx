import { For } from "solid-js";
import { parseToExercise } from "./utils";

export const Description = (props: { text: string }) => {
  return (
    <div class="mt-2 text-center">
      <For each={parseToExercise(props.text)}>
        {(part) => (
          <span
            class={`text-gray-600 ${
              part.type === "grammar" ? "font-bold" : ""
            }`}
          >
            {part.text}
          </span>
        )}
      </For>
    </div>
  );
};
