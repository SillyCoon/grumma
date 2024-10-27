import { createEffect, splitProps, type JSX } from "solid-js";
import { transliterate } from "src/utils";

export const TransliterateInput = (
	props: Omit<
		JSX.InputHTMLAttributes<HTMLInputElement>,
		"type" | "onInput" | "value"
	> & {
		clear: boolean;
		onInput: (str: string) => void;
	},
) => {
	let ref!: HTMLInputElement;
	const [{ onInput }, p] = splitProps(props, ["onInput"]);

	createEffect(() => {
		if (props.clear) {
			ref.value = "";
		}
	});

	return (
		<input
			ref={ref}
			{...p}
			type="text"
			onInput={(e) => {
				onInput(transliterate(e.target.value));
			}}
		/>
	);
};
