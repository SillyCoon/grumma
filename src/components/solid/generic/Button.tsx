import { createEffect } from "solid-js";

export const Button = (props: {
	onClick: () => void;
	class?: string;
	text: string;
	disabled: boolean;
}) => {
	createEffect(() => {
		console.log(props.disabled);
	});

	return (
		<button
			type="button"
			class={`bg-white border border-secondary text-secondary font-semibold py-2 px-4 rounded-full transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-secondary  hover:border-secondary/50 hover:text-white focus:outline-none ${props.class}`}
			onClick={props.onClick}
			disabled={props.disabled}
		>
			{props.text}
		</button>
	);
};
