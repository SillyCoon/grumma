import {
  TextField,
  TextFieldInput,
  TextFieldTextArea,
} from "packages/ui/text-field";
import { createSignal, For, Show } from "solid-js";
import { Select, SelectOption } from "packages/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "packages/ui/dialog";
import { Button } from "packages/ui/button";
import { cn } from "packages/ui/utils";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "packages/ui/context-menu";

import { v4 } from "uuid";
import { unwrap, type SetStoreFunction } from "solid-js/store";
import {
  Answer,
  Text,
  type AcceptableAnswer,
  type Exercise,
  type ExercisePart,
} from "~/features/exercise/domain";
import { actions } from "astro:actions";
import { toast } from "solid-toast";
import { exercisesStore } from "./domain";
import { DeleteConfirmation } from "@components/common/DeleteConfirmation";

const AcceptableAnswers = (props: {
  answer: Answer;
  onChange: SetStoreFunction<AcceptableAnswer[]>;
}) => {
  let addButton: HTMLButtonElement | undefined;

  return (
    <div class="flex flex-col gap-2">
      <For each={props.answer.acceptableAnswers}>
        {(answer, index) => {
          return (
            <div class="flex flex-row gap-1">
              <div class="flex grow flex-col gap-2">
                <div class="flex flex-row gap-3">
                  <TextField
                    class="grow"
                    onChange={(text) => props.onChange(index(), "text", text)}
                  >
                    <TextFieldInput
                      class={cn({
                        "text-success": answer.variant === "correct",
                        "text-destructive": answer.variant === "incorrect",
                        "text-warning": answer.variant === "try-again",
                      })}
                      value={answer.text}
                      id={`answer[${index()}]`}
                      type="text"
                      placeholder={`Acceptable answer ${index() + 1}`}
                      required
                    />
                  </TextField>
                  <Select
                    onChange={(e) => {
                      props.onChange(
                        index(),
                        "variant",
                        e.target.value as AcceptableAnswer["variant"],
                      );
                    }}
                    id={`variant[${index()}]`}
                    class="w-fit"
                    value={"incorrect"}
                  >
                    <SelectOption value="correct">Correct</SelectOption>
                    <SelectOption value="incorrect">Incorrect</SelectOption>
                    <SelectOption value="try-again">Try Again</SelectOption>
                  </Select>
                </div>
                <TextField
                  class="grow"
                  value={answer.description || ""}
                  onChange={(v) => props.onChange(index(), "description", v)}
                >
                  <TextFieldTextArea placeholder="Description (shown after answer is submitted)" />
                </TextField>
              </div>
            </div>
          );
        }}
      </For>
      <Button
        variant="ghost"
        ref={addButton}
        onClick={() => {
          props.onChange(props.answer.acceptableAnswers?.length ?? 0, {
            text: "",
            variant: "correct",
            description: "",
          });
          addButton?.scrollIntoView({ behavior: "smooth" });
        }}
      >
        Add acceptable answer
      </Button>
    </div>
  );
};

const EditAnswer = (props: {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  answer: Answer;
  onChange: SetStoreFunction<Answer>;
}) => {
  return (
    <Dialog open={props.open} onOpenChange={props.onOpenChange}>
      <DialogContent class="min-w-xl">
        <DialogHeader>
          <DialogTitle>Answer details</DialogTitle>
          <DialogDescription>
            Make the answer more informative and extend behavior on wrong
            answer.
          </DialogDescription>
        </DialogHeader>
        <div class="mt-2 flex flex-col gap-3">
          <TextField class="grow">
            <TextFieldInput
              type="text"
              value={props.answer?.text}
              placeholder="Correct answer"
              required
            />
          </TextField>
          <TextField class="grow">
            <TextFieldTextArea placeholder="Description (shown after answer is submitted)" />
          </TextField>

          <AcceptableAnswers
            answer={props.answer}
            onChange={
              props.onChange.bind(
                null,
                "acceptableAnswers",
              ) as SetStoreFunction<AcceptableAnswer[]>
            }
          />
        </div>
        <DialogFooter>
          <Button type="submit">Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const TextPart = (props: { text: Text; onChange: SetStoreFunction<Text> }) => {
  const initialValue = props.text.text;
  return (
    <span
      class="inline-block min-w-5 border-gray-400 border-b outline-none"
      contentEditable
      onInput={(e) => {
        props.onChange("text", e.currentTarget.textContent ?? "");
      }}
    >
      {initialValue}
    </span>
  );
};

const AnswerPart = (props: {
  answer: Answer;
  onChange: SetStoreFunction<Answer>;
}) => {
  const [open, setOpen] = createSignal(false);
  const initialValue = props.answer.text;
  return (
    <ContextMenu>
      <EditAnswer
        answer={props.answer}
        open={open()}
        onOpenChange={setOpen}
        onChange={props.onChange}
      />

      <ContextMenuTrigger
        contentEditable
        class="inline-block min-w-5 border-success border-b text-success outline-none"
        as="span"
        onInput={(e) =>
          props.onChange("text", e.currentTarget.textContent ?? "")
        }
      >
        {initialValue}
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem onClick={() => setOpen(true)}>
          Edit answer details
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
};

const Part = (props: {
  part: ExercisePart;
  onChange: SetStoreFunction<ExercisePart>;
}) => {
  if (props.part.type === "text") {
    return (
      <TextPart
        text={props.part}
        onChange={props.onChange as SetStoreFunction<Text>}
      />
    );
  }
  return (
    <AnswerPart
      answer={props.part}
      onChange={props.onChange as SetStoreFunction<Answer>}
    />
  );
};

export const ExerciseComponent = (props: {
  exercise: Exercise;
  setExercise: SetStoreFunction<Exercise>;
}) => {
  const validationResult = () => validate(props.exercise);
  return (
    <div class="inline-flex grow flex-wrap gap-1 py-2">
      <For each={props.exercise.parts}>
        {(part, index) => (
          <div>
            <Part
              part={part}
              onChange={
                props.setExercise.bind(
                  null,
                  "parts",
                  index(),
                ) as SetStoreFunction<ExercisePart>
              }
            />
          </div>
        )}
      </For>
      <div class="text-error">
        {validationResult() && ` ⚠️ ${validationResult()}`}
      </div>
    </div>
  );
};

const validate = (exercise: Exercise) => {
  const cleanExercise = exercise.parts.filter((p) => !!p.text.length);
  const answer = cleanExercise.find((p) => p.type === "answer");
  if (!answer) {
    return "Exercise must have at least one answer part";
  }
  if (cleanExercise.length < 2) {
    return "Exercise must have at least 2 parts";
  }
  if (cleanExercise.length > 3) {
    return "Exercises with more than 3 parts are not supported yet";
  }
};

const EmptyExercise = (order: number): Exercise => ({
  id: v4(),
  order,
  parts: [
    Text(0, "Left part of the sentence "),
    Answer(1, "answer"),
    Text(2, " right part of the sentence."),
  ],
});

export const ExercisesForm = (props: {
  grammarPointId: number;
  defaultExercises?: Exercise[];
}) => {
  const MAX_EXERCISES = 12;
  const { exercises, setExercises, deleteExercise } = exercisesStore(
    props.defaultExercises ?? [],
  );
  const hasCapacity = () => exercises.length < MAX_EXERCISES;
  return (
    <ol class="list-decimal pl-5">
      <For each={exercises}>
        {(exercise, index) => {
          const setExercise = setExercises.bind(null, index());

          return (
            <li>
              <div class="flex flex-row items-center gap-2">
                <ExerciseComponent
                  exercise={exercise}
                  setExercise={setExercise}
                />
                <DeleteConfirmation
                  title={`exercise #${index() + 1}`}
                  onDelete={() => deleteExercise(index())}
                />
              </div>
            </li>
          );
        }}
      </For>
      <Button
        variant={"ghost"}
        disabled={!hasCapacity()}
        class="w-full"
        onClick={() =>
          setExercises(exercises.length, EmptyExercise(exercises.length))
        }
      >
        <Show
          when={hasCapacity()}
          fallback={`Max number of exercises is ${MAX_EXERCISES}`}
        >
          + Add exercise
        </Show>
      </Button>
      <Button
        onClick={async () => {
          try {
            const result = await actions.createExercises({
              grammarPointId: props.grammarPointId,
              exercises: unwrap(exercises),
            });
            if (result.error) {
              toast.error("Failed to save exercises");
              console.log("Error creating exercises:", result.error);
            } else {
              toast.success("Exercises saved successfully");
            }
          } catch {
            toast.error("Failed to save exercises");
          }
        }}
      >
        Save Exercises
      </Button>
    </ol>
  );
};
