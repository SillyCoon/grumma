interface GrammarRefProps {
	id: string;
	order?: number;
	title: string;
	inReview?: boolean;
}

export const GrammarRef = (props: GrammarRefProps) => {
	return (
		<a
			href={`/grammar/${props.id}`}
			class="card shadow-md rounded-lg overflow-hidden transform transition-transform hover:scale-105 duration-300 hover:shadow-lg cursor-pointer"
		>
			<div class="card-body">
				<h2 class="card-title text-secondary justify-between">
					<span>
						{props.order}: {props.title}
					</span>
					{props.inReview && (
						<span class="badge badge-primary min-w-[85px]">In review</span>
					)}
				</h2>
			</div>
		</a>
	);
};
