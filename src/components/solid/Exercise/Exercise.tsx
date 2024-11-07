import { Button } from "../generic/Button";
import { SendButton } from "../generic/SendButton";
import { AnswerResult } from "./AnswerResult";
import { Description } from "./Description";
import { Task } from "./Task";
import { Show, createEffect, createResource, createSignal } from "solid-js";

import type { Exercise as ExerciseType } from "@grammar-sdk";

import { normalizeAnswer, parseToExercise } from "./utils";
import { GrammarPoint } from "../grammar-point/GrammarPoint";
import { TransliterateInput } from "./TransliterateInput";
import { actions } from "astro:actions";

export interface ExerciseProps {
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

	const checkAnswer = () => setIsCorrect(correctAnswer() === answer());
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
			<div class="flex items-center justify-center h-screen">
				<div
					class={`bg-white shadow-lg rounded-lg p-6 max-w-xl w-full ${
						isCorrect() === true
							? "border border-green-200 shadow-green-200"
							: isCorrect() === false && "border border-red-200 shadow-red-200"
					}`}
				>
					<Task
						text={props.exercise.ru}
						answer={answer()}
						draft={props.exercise.draft}
					/>
					<Description text={props.exercise.en} />
					<div class="mt-4 flex w-full items-center">
						<TransliterateInput
							ref={input}
							autofocus
							clear={!answer()}
							onkeydown={(e) => e.code === "Enter" && handleSubmit()}
							onInput={(str) => {
								setAnswer(normalizeAnswer(str));
							}}
							class="p-2 grow border border-primary rounded focus"
							placeholder="Type here..."
						/>
						<span class="flex-none p-2">
							<SendButton onClick={handleSubmit} />
						</span>
					</div>
					<div class="mt-5 flex justify-end">
						<Button
							onClick={() => setShowGrammarPoint(true)}
							text={"Show grammar point"}
							disabled={notAnswered()}
						/>
					</div>

					<AnswerResult
						isCorrect={isCorrect()}
						correctAnswer={correctAnswer() ?? ""}
					/>
				</div>
			</div>
			<Show when={showGrammarPoint()}>
				<LoadingGrammarPoint grammarPointId={props.exercise.grammarPointId} />
			</Show>
		</>
	);
};

const LoadingGrammarPoint = (props: { grammarPointId: string }) => {
	const [gp] = createResource(
		{ grammarPointId: props.grammarPointId },
		actions.grammarPoint,
	);
	let ref: HTMLDivElement;

	createEffect(() => {
		if (gp()) {
			ref.scrollIntoView({ behavior: "smooth" });
		}
	});

	// TODO: support explanations

	return (
		<Show when={gp()}>
			{(g) => (
				<div ref={ref}>
					{/* biome-ignore lint/style/noNonNullAssertion: <explanation> */}
					{g() && <GrammarPoint {...g().data!} />}
				</div>
			)}
		</Show>
	);
};
