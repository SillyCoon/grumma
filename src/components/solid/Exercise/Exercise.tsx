import { Show, createResource, createSignal } from "solid-js";
import { SendButton } from "../generic/SendButton";
import { AnswerResult } from "./AnswerResult";
import { Description } from "./Description";
import { Task } from "./Task";

import type { Exercise as ExerciseType } from "grammar-sdk";

import { actions } from "astro:actions";
import { Button } from "ui/button";
import { Sheet, SheetContent, SheetTrigger } from "ui/sheet";
import { Spinner } from "ui/Spinner";
import { GrammarPoint } from "../grammar-point/GrammarPoint";
import { Feedback } from "./Feedback";
import { TransliterateInput } from "./TransliterateInput";
import { TransliterationRules } from "./TransliterationRules";
import { compareAnswer, normalizeAnswer, parseToExercise } from "./utils";

interface ExerciseProps {
  exercise: ExerciseType;
  handleNext: (
    completed: ExerciseType,
    result: { answer: string; correct: boolean },
  ) => void;
}

export const Exercise = (props: ExerciseProps) => {
  let input!: HTMLInputElement;

  const [answer, setAnswer] = createSignal<string>("");
  const [isCorrect, setIsCorrect] = createSignal<boolean | undefined>(
    undefined,
  );

  const [showGrammarPoint, setShowGrammarPoint] = createSignal(false);

  const notAnswered = () => isCorrect() === undefined;

  const correctAnswer = () =>
    normalizeAnswer(
      parseToExercise(props.exercise.ru).find((v) => v.type === "grammar")
        ?.text ?? "",
    );

  const handleSubmit = () => {
    if (notAnswered()) {
      checkAnswer();
    } else {
      handleNext();
    }
  };

  const checkAnswer = () =>
    setIsCorrect(compareAnswer(correctAnswer(), answer()));
  const handleNext = () => {
    props.handleNext(props.exercise, {
      answer: answer(),
      correct: isCorrect() ?? true,
    });
    setAnswer("");
    setIsCorrect(undefined);
    setShowGrammarPoint(false);
    input.focus();
  };

  return (
    <>
      <div class="flex shrink-0 grow justify-center md:items-center">
        <div class="w-full">
          <Task
            text={props.exercise.ru}
            answer={answer()}
            draft={props.exercise.draft}
          />
          <Description text={props.exercise.en} />
          <form
            class="mx-auto mt-4 flex max-w-[31.25rem] items-center "
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit();
            }}
          >
            <TransliterateInput
              ref={input}
              autofocus
              clear={!answer()}
              onInput={(str) => {
                setAnswer(normalizeAnswer(str));
              }}
              class="focus h-[40px] grow rounded border border-secondary p-2 focus:outline-primary"
            />
            <SendButton class="-ml-10" type="submit" />
          </form>
          <div class="mt-5 flex justify-center">
            <Sheet>
              <SheetTrigger>
                <Button variant="ghost" disabled={notAnswered()}>
                  Grammar
                </Button>
              </SheetTrigger>
              <SheetContent class="h-screen" position={"bottom"}>
                <LoadingGrammarPoint
                  grammarPointId={props.exercise.grammarPointId}
                />
              </SheetContent>
            </Sheet>

            <TransliterationRules />
            <Feedback exercise={props.exercise} />
          </div>

          <AnswerResult
            isCorrect={isCorrect()}
            correctAnswer={correctAnswer() ?? ""}
          />
        </div>
      </div>
    </>
  );
};

const LoadingGrammarPoint = (props: { grammarPointId: string }) => {
  const [gp] = createResource(
    { grammarPointId: props.grammarPointId },
    actions.grammarPoint,
  );
  let ref!: HTMLDivElement;

  return (
    <Show when={gp()} fallback={<Spinner />}>
      {(g) => (
        <div ref={ref}>
          {/* biome-ignore lint/style/noNonNullAssertion: <explanation> */}
          {g() && <GrammarPoint {...g().data!} />}
        </div>
      )}
    </Show>
  );
};
