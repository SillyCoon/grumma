import { IoSend } from "solid-icons/io";
import type { ParentComponent } from "solid-js";

export const SendButton: ParentComponent<{
	onClick: () => void;
}> = (props) => {
	return (
		<IoSend
			size={24}
			class="text-secondary hover:text-secondary-800 cursor-pointer"
			onClick={props.onClick}
		/>
	);
};
