import type { GrammarPoint as GrammarPointType } from "grammar-sdk";
import { For, Show } from "solid-js";
import { Badge } from "ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "ui/card";
import { IconButton } from "ui/icon-button";
import { ArrowBack } from "ui/icons";
import { Example } from "../example/Example";
import { StartLesson } from "./StartLesson";
import { Title } from "./Title";
import { StructureDisplay } from "./StructureDisplay";

type Props = Omit<GrammarPointType, "exercises"> & {
  explanation?: string;
  next?: string;
  backTo?: string;
  inReview?: boolean;
};

export const GrammarPoint = (props: Props) => {
  return (
    <section class="grid gap-5">
      <div class="flex items-center justify-between">
        <Show when={props.backTo}>
          <IconButton
            href={props.backTo}
            class="hidden md:block"
            variant="primary"
          >
            <ArrowBack title="Back" />
          </IconButton>
        </Show>

        <Title
          className="flex-1"
          shortTitle={props.shortTitle}
          detailedTitle={props.detailedTitle ?? ""}
          englishTitle={props.englishTitle ?? ""}
        />
      </div>
      <Show when={props.backTo}>
        <div class="md:hidden">
          <IconButton href={props.backTo} variant="primary">
            <ArrowBack title="Back" />
          </IconButton>
        </div>
      </Show>

      <div class="flex justify-end">
        <Show when={props.inReview}>
          <Badge variant="success">In review</Badge>
        </Show>
      </div>

      <Card variant="outlined">
        <CardHeader>
          <CardTitle>Structure</CardTitle>
        </CardHeader>
        <CardContent>
          <StructureDisplay structure={props.structure} />
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
          <section
            class="prose prose-slate max-w-none [&_strong]:text-secondary "
            innerHTML={props.explanation ?? "Coming soon!"}
          />
        </CardContent>
      </Card>
      {props.next && <StartLesson />}
    </section>
  );
};
