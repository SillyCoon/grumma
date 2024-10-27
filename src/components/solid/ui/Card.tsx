import type { ParentComponent } from "solid-js";

interface Props {
	title: string;
}

export const Card: ParentComponent<Props> = ({ title, children }) => {
	return (
		<div class="card w-full bg-base-100 shadow-md">
			<div class="card-body">
				<h2 class="card-title text-primary">{title}</h2>
				<p>{children}</p>
			</div>
		</div>
	);
};
