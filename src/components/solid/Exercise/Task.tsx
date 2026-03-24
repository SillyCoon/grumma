import { For } from "solid-js";
import { Answer } from "./Answer";
import type { ExercisePart } from "grammar-sdk/exercise";

export const Task = (props: { parts: ExercisePart[]; answer?: string }) => {
  return (
    <div class="text-center font-semibold text-primary text-xl md:text-3xl">
      <For each={props.parts}>
        {(part) =>
          part.type === "text" ? (
            <span>{part.text}</span>
          ) : (
            <Answer answer={props.answer} />
          )
        }
      </For>
    </div>
  );
};
