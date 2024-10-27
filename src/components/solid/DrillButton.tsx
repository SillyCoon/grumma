import { createSignal } from "solid-js";
import { Toaster } from "solid-toast";
import type { Drill } from "../../models/drill";
import type { GrammarPointType } from "../../services/grammar";
import { fetchWithToast } from "./utils";

export const DrillButton = (props: {
	grammarPoint: Omit<GrammarPointType, "exercises">;
	drill?: Drill;
}) => {
	const [submitted, setSubmitted] = createSignal(false);
	const disabled = () => !!props.drill || submitted();

	const handleAddToDrill = async () => {
		setSubmitted(true);
		await fetchWithToast(
			"/api/drill",
			{
				body: props.grammarPoint,
				method: "POST",
			},
			"Successfully added to drill!",
			"Error has occurred , try to add later!",
		);
	};

	const handleRemoveFromDrill = async () => {
		setSubmitted(false);
		await fetchWithToast(
			`/api/drill/${props.grammarPoint.id}`,
			{
				method: "DELETE",
			},
			"Successfully removed from drill!",
			"Can't remove drill, please try again later!",
		);
	};

	return (
		<div class="flex gap-5">
			<button
				type="button"
				disabled={!disabled()}
				onClick={handleRemoveFromDrill}
				class="flex-1 bg-red-600 enabled:hover:bg-red-700 text-white px-6 py-3 rounded-full shadow-md text-center disabled:opacity-50 disabled:cursor-not-allowed"
			>
				{"Remove from drill"}
			</button>
			<button
				type="button"
				disabled={disabled()}
				onClick={handleAddToDrill}
				class="flex-1 bg-blue-500 enabled:hover:bg-blue-600 text-white px-6 py-3 rounded-full shadow-md text-center disabled:opacity-50 disabled:cursor-not-allowed"
			>
				{props.drill ? "Already in drill" : "Drill"}
			</button>
			<Toaster />
		</div>
	);
};
