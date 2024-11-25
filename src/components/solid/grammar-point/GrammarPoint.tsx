import { Card, CardContent, CardHeader, CardTitle } from "@components/ui/card";
import type { GrammarPoint as GrammarPointType } from "@grammar-sdk";
import { For } from "solid-js";
import { Example } from "../example/Example";
import { ForwardButton } from "../generic/ForwardButton";
import { Title } from "./Title";

type Props = Omit<GrammarPointType, "exercises"> & {
  explanation?: string;
  next?: string;
};

export const GrammarPoint = (props: Props) => {
  return (
    <section class="grid gap-5">
      <div class="flex items-center justify-between">
        <Title
          className="flex-auto"
          shortTitle={props.shortTitle}
          detailedTitle={props.detailedTitle}
          englishTitle={props.englishTitle}
        />
        {props.next && <ForwardButton href={props.next} />}
      </div>

      <Card variant="outlined">
        <CardHeader>
          <CardTitle>Structure</CardTitle>
        </CardHeader>
        <CardContent>
          <section
            class="prose whitespace-pre-line [&_b]:text-secondary"
            innerHTML={props.structure}
          />
        </CardContent>
      </Card>
      <Card variant="outlined">
        <CardHeader>
          <CardTitle>Examples</CardTitle>
        </CardHeader>
        <CardContent>
          <section class="grid gap-5">
            <For each={props.examples}>{(e) => <Example {...e} />}</For>
          </section>
        </CardContent>
      </Card>

      <Card variant="outlined">
        <CardHeader>
          <CardTitle>Explanation</CardTitle>
        </CardHeader>
        <CardContent>
          {props.explanation && (
            <section
              class="prose prose-slate max-w-none [&_strong]:text-secondary "
              innerHTML={props.explanation}
            />
          )}
        </CardContent>
      </Card>
    </section>
  );
};
