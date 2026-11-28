import { TextField, TextFieldInput, TextFieldTextArea } from "ui/text-field";
import { children, createSignal, For, Match, Switch } from "solid-js";
import { Select, SelectOption } from "ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "ui/dialog";
import { Button } from "ui/button";
import { cn } from "ui/utils";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "ui/context-menu";

import type { SetStoreFunction } from "solid-js/store";
import type { JSX } from "astro/jsx-runtime";
import type {
  AcceptableAnswer,
  Answer,
  Exercise,
  ExercisePart,
  Text,
} from "grammar-sdk/exercise";

type PlaceholderLanguage = "ru" | "en";
const TEXT_PLACEHOLDERS: Record<PlaceholderLanguage, Record<number, string>> = {
  ru: {
    0: "Левая часть предложения ",
    2: " правая часть предложения.",
  },
  en: {
    0: "Left part of the sentence ",
    2: " right part of the sentence.",
  },
} as const;

const ANSWER_PLACEHOLDERS: Record<PlaceholderLanguage, string> = {
  ru: "ответ",
  en: "answer",
} as const;

const AcceptableAnswers = (props: {
  answer: Answer;
  onChange: SetStoreFunction<AcceptableAnswer[]>;
}) => {
  let addButton: HTMLButtonElement | undefined;
  console.log(props.answer.acceptableAnswers);

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
                  <Select<AcceptableAnswer["variant"]>
                    onSelect={(value) => {
                      props.onChange(index(), "variant", value);
                    }}
                    id={`variant[${index()}]`}
                    class="w-fit"
                    value={answer.variant}
                  >
                    <For
                      each={
                        [
                          { label: "Correct", value: "correct" },
                          { label: "Incorrect", value: "incorrect" },
                          { label: "Try Again", value: "try-again" },
                        ] as const
                      }
                    >
                      {(variant) => (
                        <SelectOption
                          value={variant.value}
                          selected={answer.variant === variant.value}
                        >
                          {variant.label}
                        </SelectOption>
                      )}
                    </For>
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
          <TextField class="grow" onChange={(v) => props.onChange("text", v)}>
            <TextFieldInput
              type="text"
              value={props.answer?.text}
              placeholder="Correct answer"
              required
            />
          </TextField>
          <TextField
            class="grow"
            onChange={(v) => props.onChange("description", v)}
            value={props.answer?.description || ""}
          >
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
          <Button type="button" onClick={() => props.onOpenChange?.(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const TextPart = (props: {
  text: Text;
  language: PlaceholderLanguage;
  onChange: SetStoreFunction<Text>;
}) => {
  const initialValue = props.text.text;
  const placeholder = () => TEXT_PLACEHOLDERS[props.language][props.text.index];
  return (
    // biome-ignore lint/a11y/useSemanticElements: contentEditable span is required for auto-sizing inline text
    <span
      class="inline-block min-w-5 border-gray-400 border-b outline-none"
      contentEditable
      role="textbox"
      tabIndex={0}
      aria-label={placeholder()}
      data-placeholder={placeholder()}
      data-empty={props.text.text.trim().length === 0}
      onInput={(e) => {
        props.onChange("text", e.currentTarget.textContent ?? "");
      }}
      onBlur={(event) => {
        if (!(event.currentTarget.textContent ?? "").trim()) {
          event.currentTarget.textContent = "";
        }
      }}
    >
      {initialValue}
    </span>
  );
};

const AnswerPart = (props: {
  answer: Answer;
  language: "ru" | "en";
  onChange: SetStoreFunction<Answer>;
}) => {
  const [open, setOpen] = createSignal(false);
  return (
    <ContextMenu>
      <EditAnswer
        answer={props.answer}
        open={open()}
        onOpenChange={setOpen}
        onChange={props.onChange}
      />

      <ContextMenuTrigger as="span">
        <PlainAnswerPart
          answer={props.answer}
          language={props.language}
          onChange={props.onChange}
        />
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem onClick={() => setOpen(true)}>
          Edit answer details
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
};

const PlainAnswerPart = (props: {
  answer: Answer;
  language: "ru" | "en";
  onChange: SetStoreFunction<Answer>;
}) => {
  return (
    <input
      class="inline-block min-w-5 border-success border-b text-success outline-none"
      value={props.answer.text}
      placeholder={ANSWER_PLACEHOLDERS[props.language]}
      onChange={(e) => props.onChange("text", e.currentTarget.value ?? "")}
    />
  );
};

const Part = (props: {
  part: ExercisePart;
  onChange: SetStoreFunction<ExercisePart>;
}) => {
  return (
    <Switch>
      <Match when={props.part.type === "answer"}>
        <AnswerPart
          answer={props.part as Answer}
          language="ru"
          onChange={props.onChange as SetStoreFunction<Answer>}
        />
      </Match>
      <Match when={props.part.type === "text"}>
        <TextPart
          text={props.part as Text}
          language="ru"
          onChange={props.onChange as SetStoreFunction<Text>}
        />
      </Match>
    </Switch>
  );
};

const TranslationPart = (props: {
  part: ExercisePart;
  onChange: SetStoreFunction<ExercisePart>;
}) => {
  return (
    <Switch>
      <Match when={props.part.type === "answer"}>
        <PlainAnswerPart
          answer={props.part as Answer}
          language="en"
          onChange={props.onChange as SetStoreFunction<Answer>}
        />
      </Match>
      <Match when={props.part.type === "text"}>
        <TextPart
          text={props.part as Text}
          language="en"
          onChange={props.onChange as SetStoreFunction<Text>}
        />
      </Match>
    </Switch>
  );
};

const PartsWrapper = (props: { children: JSX.Element }) => {
  const resolved = children(() => props.children);
  return <div class={"inline-flex grow flex-wrap gap-1"}>{resolved()}</div>;
};

type PartsProps = {
  parts: ExercisePart[];
  setExercise: SetStoreFunction<Exercise>;
};

const Parts = (props: PartsProps) => {
  return (
    <PartsWrapper>
      <For each={props.parts}>
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
    </PartsWrapper>
  );
};

const TranslationParts = (props: PartsProps) => {
  return (
    <PartsWrapper>
      <For each={props.parts}>
        {(part, index) => (
          <div>
            <TranslationPart
              part={part}
              onChange={
                props.setExercise.bind(
                  null,
                  "translationParts",
                  index(),
                ) as SetStoreFunction<ExercisePart>
              }
            />
          </div>
        )}
      </For>
    </PartsWrapper>
  );
};

export const ExerciseInput = (props: {
  exercise: Exercise;
  setExercise: SetStoreFunction<Exercise>;
}) => {
  const validationResult = () => validate(props.exercise);
  return (
    <div class={cn("flex grow flex-col flex-wrap gap-2 py-2")}>
      <Parts parts={props.exercise.parts} setExercise={props.setExercise} />
      <TranslationParts
        parts={props.exercise.translationParts}
        setExercise={props.setExercise}
      />
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
