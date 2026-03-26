import { For } from "solid-js";
import type { ExercisePart } from "grammar-sdk/exercise";

export const Description = (props: { parts: ExercisePart[] }) => {
  return (
    <div class="mt-2 text-center" data-testid="exercise-description">
      <For each={props.parts}>
        {(part) => (
          <span
            class={`text-gray-600 ${part.type === "answer" ? "font-bold" : ""}`}
          >
            {part.text}
          </span>
        )}
      </For>
    </div>
  );
};
