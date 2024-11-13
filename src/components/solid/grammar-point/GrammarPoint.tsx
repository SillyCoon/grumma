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
      <div class="flex justify-between items-center">
        <Title className="flex-auto" title={props.title} />
        {props.next && <ForwardButton href={props.next} />}
      </div>

      <Card variant="outlined">
        <CardHeader>
          <CardTitle>Structure</CardTitle>
        </CardHeader>
        <CardContent>
          <section
            class="whitespace-pre-line prose [&_b]:text-secondary"
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
              class="prose prose-slate [&_strong]:text-secondary  max-w-none "
              innerHTML={props.explanation}
            />
          )}
        </CardContent>
      </Card>
    </section>
  );
};
