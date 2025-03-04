import type { Example as ExampleSentence } from "grammar-sdk/example";
import { ArrowForward } from "packages/ui/icons";
import { Show, createSignal } from "solid-js";
import { Button } from "ui/button";
import { Card, CardContent } from "ui/card";
import { IconButton } from "ui/icon-button";
import { Part } from "./Part";

type Props = {
  ru: ExampleSentence;
  en: ExampleSentence;
  alwaysShow?: boolean;
  grammarHref?: string;
  variant?: "neutral" | "correct" | "wrong";
};

export const Example = (props: Props) => {
  const [showTranslation, setShowTranslation] = createSignal(
    props.alwaysShow ?? false,
  );

  return (
    <Card variant="outlined">
      <CardContent class="relative flex flex-col pt-6">
        <Part part={props.ru} variant={props.variant} />
        <Show
          when={showTranslation()}
          fallback={
            <Button variant="ghost" onClick={() => setShowTranslation(true)}>
              Show translations
            </Button>
          }
        >
          <Part part={props.en} variant={props.variant} />
        </Show>
        <Show when={props.grammarHref}>
          <IconButton
            class="absolute top-1/3 right-0 md:right-10 "
            href={props.grammarHref}
            variant="primary"
          >
            <ArrowForward class="size-7 md:size-10" title="To Grammar Point" />
          </IconButton>
        </Show>
      </CardContent>
    </Card>
  );
};
