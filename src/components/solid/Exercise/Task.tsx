import { For } from "solid-js";
import { Answer } from "./Answer";
import { parseToExercise } from "./utils";

export const Task = (props: {
  text: string;
  answer?: string;
  draft?: string;
}) => (
  <div class="text-3xl font-semibold text-center text-primary">
    <For each={parseToExercise(props.text)}>
      {(part) =>
        part.type === "text" ? (
          <span>{part.text}</span>
        ) : (
          <Answer answer={props.answer} />
        )
      }
    </For>
    <span>{props.draft && !props.answer && ` (${props.draft})`}</span>
  </div>
);
