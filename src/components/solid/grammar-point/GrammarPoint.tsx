import type { GrammarPointType } from "@services/grammar";
import { Card } from "@ui/Card";
import { Example } from "../example/Example";
import { ForwardButton } from "../generic/ForwardButton";
import { Title } from "./Title";
import { For } from "solid-js";

type Props = Omit<GrammarPointType, "exercises"> & {
	explanation?: string;
	next?: string;
};

export const GrammarPoint = (props: Props) => {
	return (
		<section class="grid gap-5">
			<div class="flex justify-between items-center">
				<Title className="flex-auto" title={props.title} />
				{props.next && <ForwardButton href={props.next} />}
			</div>

			<Card title="Structure">
				<section
					class="whitespace-pre-line [&_b]:text-secondary"
					innerHTML={props.structure}
				/>
			</Card>
			<Card title="Examples">
				<section class="grid gap-5">
					<For each={props.examples}>{(e) => <Example {...e} />}</For>
				</section>
			</Card>

			<Card title="Explanation">
				{props.explanation && (
					<section
						class="whitespace-pre-line [&_strong]:text-secondary"
						innerHTML={props.explanation}
					/>
				)}
			</Card>
		</section>
	);
};
