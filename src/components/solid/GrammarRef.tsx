import { Badge } from "@components/ui/badge";
import {
	Card,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
	CardContent,
} from "@components/ui/card";

interface GrammarRefProps {
	id: string;
	order?: number;
	title: string;
	inReview?: boolean;
}

export const GrammarRef = (props: GrammarRefProps) => {
	const [mainTitle, detailedTitle, enTitle] = props.title.split("/") as [
		string,
		string,
		string,
	];

	return (
		<a href={`/grammar/${props.id}`}>
			<Card class="hover:shadow-md active:shadow-sm hover:opacity-75 active:opacity-100 transition-all min-h-full">
				<CardHeader>
					<div class="flex items-center justify-between gap-1">
						<CardTitle class="whitespace-nowrap text-ellipsis overflow-x-hidden">
							{mainTitle}
						</CardTitle>
						{props.inReview && (
							<Badge variant="success" class="min-w-[77px]">
								In review
							</Badge>
						)}
					</div>

					<CardDescription>{detailedTitle}</CardDescription>
				</CardHeader>
				<CardFooter class="mt-auto">
					<p>{enTitle}</p>
				</CardFooter>
			</Card>
		</a>
	);
};
