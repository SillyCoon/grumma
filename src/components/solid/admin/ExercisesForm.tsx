import { AddIcon } from "packages/ui/icons";
import { Label } from "packages/ui/label";
import { IconButton } from "ui/icon-button";
import {
  TextField,
  TextFieldInput,
  TextFieldTextArea,
} from "packages/ui/text-field";
import { createSignal, For, Show } from "solid-js";
import { AiFillDelete, AiFillEdit } from "solid-icons/ai";
import { Select, SelectOption } from "packages/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "packages/ui/dialog";
import { Button } from "packages/ui/button";
import { createStore, produce } from "solid-js/store";
import { HtmlCheckbox } from "packages/ui/html-checkbox";
import { cn } from "packages/ui/utils";

type Exercise = ExercisePart[];
type ExercisePart = Text | Answer;
type Text = { index: number; type: "text"; text: string };
const EmptyText = (index: number): Text => ({ index, type: "text", text: "" });
type Answer = {
  type: "answer";
  text: string;
  description?: string;
  index: number;
  acceptableAnswers?: AcceptableAnswer[];
};
const EmptyAnswer = (index: number): Answer => ({
  type: "answer",
  text: "",
  index,
  acceptableAnswers: [],
});

type AcceptableAnswer = {
  text: string;
  description?: string;
  variant: "correct" | "incorrect" | "try-again";
};

const textFromPart = (part: ExercisePart): Text => {
  if (part.type === "text") {
    return part;
  }
  return { type: "text", text: part.text, index: part.index };
};

const answerFromPart = (index: number, part: ExercisePart): Answer => {
  if (part.type === "answer") {
    return part;
  }
  return {
    type: "answer",
    text: part.text,
    index,
    acceptableAnswers: [],
  };
};

const [exercise, setExercise] = createStore<Exercise>([
  EmptyText(0),
  EmptyAnswer(1),
  EmptyText(2),
]);

const acceptableAnswersFor = (index: number) => {
  const part = exercise.find((p) => p.index === index);
  if (part?.type === "answer") {
    return part.acceptableAnswers ?? [];
  }
  return [];
};

const updatePartText = (index: number, text: string) => {
  setExercise(
    produce<Exercise>((exercise) => {
      const part = exercise.find((p) => p.index === index);
      if (!part) return;
      part.text = text;
    }),
  );
};

const addAcceptableAnswer = (
  newAcceptableAnswer: AcceptableAnswer,
  index: number,
) => {
  setExercise(
    produce<Exercise>((exercise) => {
      const answer = exercise.find((part) => part.index === index);
      if (!answer || answer?.type !== "answer") return;
      answer.acceptableAnswers?.push(newAcceptableAnswer);
    }),
  );
};

const addPart = (part: ExercisePart) => {
  setExercise((exercise) => {
    const res = exercise
      .toSpliced(part.index + 1, 0, part)
      .map((p, i) => ({ ...p, index: i }));
    return res;
  });
};

const deletePart = (index: number) => {
  setExercise((exercise) => exercise.toSpliced(index, 1));
};

const convertPart = (index: number) => {
  setExercise((exercise) => {
    const part = exercise.find((p) => p.index === index);
    if (!part) return exercise;
    const newPart =
      part.type === "text" ? answerFromPart(index, part) : textFromPart(part);
    return exercise.toSpliced(index, 1, newPart);
  });
};

const answersBeforeIndex = (index: number) => {
  return exercise.filter((part) => part.type === "answer" && part.index < index)
    .length;
};

const hasAnswerRightBefore = (index: number) => {
  if (index === 0) return false;
  const part = exercise.find((p) => p.index === index - 1);
  return part?.type === "answer";
};

const AcceptableAnswers = (props: { answerIndex: number }) => {
  let addButton: HTMLButtonElement | undefined;
  const [variant, setVariant] = createSignal<string>("correct");

  return (
    <div class="flex flex-col gap-2">
      <For each={acceptableAnswersFor(props.answerIndex)}>
        {(_field, index) => (
          <div class="flex flex-row gap-1">
            <div class="flex grow flex-col gap-2">
              <div class="flex flex-row gap-3">
                <TextField class="grow">
                  <TextFieldInput
                    class={cn({
                      "text-success": variant() === "correct",
                      "text-destructive": variant() === "incorrect",
                      "text-warning": variant() === "try-again",
                    })}
                    id={`answer[${index()}]`}
                    type="text"
                    placeholder={`Acceptable answer ${index() + 1}`}
                  />
                </TextField>
                <Select
                  onChange={(e) => {
                    setVariant(e.target.value);
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
              <TextField class="grow">
                <TextFieldTextArea placeholder="Description (shown after answer is submitted)" />
              </TextField>
            </div>
          </div>
        )}
      </For>
      <Button
        variant="ghost"
        ref={addButton}
        onClick={() => {
          addAcceptableAnswer(
            { text: "", variant: "correct" },
            props.answerIndex,
          );
          addButton?.scrollIntoView({ behavior: "smooth" });
        }}
      >
        Add acceptable answer
      </Button>
    </div>
  );
};

const Part = (props: {
  index: number;
  isAnswer?: boolean;
  onClick: () => void;
  onDelete: () => void;
}) => {
  return (
    <div class="flex flex-row content-en">
      <IconButton variant="primary" size={"md"} onClick={props.onClick}>
        <AddIcon />
      </IconButton>
      <div class="grow">
        <div class="flex flex-row gap-3">
          <TextField
            value={exercise.find((p) => p.index === props.index)?.text ?? ""}
            class="grow"
            onChange={(e) => updatePartText(props.index, e)}
          >
            <TextFieldInput
              class={cn({
                "text-success": props.isAnswer,
              })}
              type="text"
              placeholder={
                props.isAnswer
                  ? `Answer ${answersBeforeIndex(props.index) + 1}`
                  : "Text"
              }
            />
          </TextField>
          <div class="flex items-center gap-2">
            <HtmlCheckbox
              id="answer"
              name="answer"
              checked={props.isAnswer}
              disabled={hasAnswerRightBefore(props.index)}
              onClick={() => convertPart(props.index)}
            />
            <Label for="answer">Answer?</Label>
          </div>
        </div>
      </div>
      <Show when={props.isAnswer}>
        <EditAnswer index={props.index} />
      </Show>
      <IconButton variant={"destructive"} size={"md"} onClick={props.onDelete}>
        <AiFillDelete />
      </IconButton>
    </div>
  );
};

const EditAnswer = (props: { index: number }) => {
  const answer = exercise.find((p) => p.index === props.index);
  return (
    <Dialog>
      <DialogTrigger>
        <IconButton variant={"primary"} size={"md"}>
          <AiFillEdit />
        </IconButton>
      </DialogTrigger>
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
              value={answer?.text}
              placeholder="Correct answer"
            />
          </TextField>
          <TextField class="grow">
            <TextFieldTextArea placeholder="Description (shown after answer is submitted)" />
          </TextField>

          <AcceptableAnswers answerIndex={props.index} />
        </div>
        <DialogFooter>
          <Button type="submit">Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export const ExerciseBuilder = () => {
  return (
    <div class="flex flex-col gap-2">
      <For each={exercise}>
        {(p, index) => (
          <Part
            index={p.index}
            isAnswer={p.type === "answer"}
            onClick={() => addPart(EmptyText(index()))}
            onDelete={() => {
              deletePart(index());
            }}
          />
        )}
      </For>
      <ExercisePreview exercise={exercise} />
    </div>
  );
};

const TextPreview = (props: { text: Text }) => {
  return <span>{props.text.text} </span>;
};

const AnswerPreview = (props: { answer: Answer }) => {
  return <span class="text-success">{props.answer.text} </span>;
};

export const ExercisePreview = (props: { exercise: Exercise }) => {
  return (
    <div class="inline">
      <For each={props.exercise}>
        {(part) => {
          if (part.type === "text") {
            return <TextPreview text={part} />;
          }
          return <AnswerPreview answer={part} />;
        }}
      </For>
    </div>
  );
};
