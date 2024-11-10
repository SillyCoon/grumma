import { For } from "solid-js";
import { GrammarRef } from "./GrammarRef";
import type { GrammarPoint } from "@grammar-sdk";

interface GrammarProps {
	torfl: string;
	grammar: GrammarPoint[];
	inReview?: string[];
}

export const GrammarBlock = (props: GrammarProps) => {
	const inReviewSet = new Set(props.inReview);
	return (
		<section>
			<h1 class="text-foregrounds-primary text-5xl mb-2">{props.torfl}</h1>
			<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
				<For each={props.grammar}>
					{(gp) => <GrammarRef {...gp} inReview={!!inReviewSet.has(gp.id)} />}
				</For>
			</div>
		</section>
	);
};
