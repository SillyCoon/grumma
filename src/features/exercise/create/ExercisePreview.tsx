import { For } from "solid-js";
import type { Exercise, ExercisePart } from "../domain";
import { cn } from "packages/ui/utils";

const PartsPreview = (props: { parts: ExercisePart[] }) => {
  return (
    <div class={cn("inline-flex grow flex-wrap gap-1")}>
      <For each={props.parts}>
        {(part) => (
          <div>
            {part.type === "text" ? (
              <span>{part.text}</span>
            ) : (
              <span class="text-success">{part.text}</span>
            )}
          </div>
        )}
      </For>
    </div>
  );
};

export const ExercisePreview = (props: { exercise: Exercise }) => {
  return (
    <div
      class={cn("flex flex-col flex-wrap gap-1 py-2", {
        "opacity-50": props.exercise.hide,
      })}
    >
      <PartsPreview parts={props.exercise.parts} />
      <PartsPreview parts={props.exercise.translationParts} />
    </div>
  );
};
