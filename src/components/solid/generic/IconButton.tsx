import type { IconTypes } from "solid-icons";

export const IconButton = (props: {
	onClick?: () => void;
	Icon: IconTypes;
	disabled?: boolean;
}) => {
	return (
		<button type="button" onClick={props.onClick} disabled={props.disabled}>
			<props.Icon
				size={40}
				class="text-primary hover:text-primary/60 cursor-pointer"
			/>
		</button>
	);
};
