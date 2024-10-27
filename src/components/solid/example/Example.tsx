import type { Example as ExampleSentence } from "@grammar-sdk";
import { Part } from "./Part";
import { Show, createSignal } from "solid-js";

type Props = { ru: ExampleSentence; en: ExampleSentence };

export const Example = (props: Props) => {
	const [showTranslation, setShowTranslation] = createSignal(false);

	return (
		<div class="card w-full bg-neutral-content shadow-md">
			<div class="card-body">
				<Part part={props.ru} />
				<Show
					when={showTranslation()}
					fallback={
						<button
							type="button"
							onClick={() => setShowTranslation(true)}
							class="btn btn-ghost btn-sm"
						>
							Show translations
						</button>
					}
				>
					<Part part={props.en} />
				</Show>
			</div>
		</div>
	);
};
