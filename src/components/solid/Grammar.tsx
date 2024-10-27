import { For } from "solid-js";
import { GrammarRef } from "./GrammarRef";
import type { GrammarPoint } from "@grammar-sdk";

interface GrammarProps {
	grammar: GrammarPoint[];
	inReview?: string[];
}

export const Grammar = (props: GrammarProps) => {
	const reviewMap = new Map(props.inReview?.map((v) => [v, true]));
	return (
		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-4">
			<For each={props.grammar}>
				{(gp) => <GrammarRef {...gp} inReview={reviewMap.get(gp.id)} />}
			</For>
		</div>
	);
};
