import { Badge } from "@components/ui/badge";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@components/ui/card";
import { Checkbox } from "@components/ui/checkbox";

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
    <div>
      <Checkbox id="1"></Checkbox>
      <a href={`/grammar/${props.id}`}>
        <Card class="min-h-full transition-all hover:opacity-75 hover:shadow-md active:opacity-100 active:shadow-sm">
          <CardHeader>
            <div class="flex items-center justify-between gap-1">
              <CardTitle class="overflow-x-hidden text-ellipsis whitespace-nowrap">
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
    </div>
  );
};
