import type { Example as ExampleSentence } from "grammar-sdk";
import { Show, createSignal } from "solid-js";
import { Button } from "ui/button";
import { Card, CardContent } from "ui/card";
import { Part } from "./Part";

type Props = {
  ru: ExampleSentence;
  en: ExampleSentence;
  alwaysShow?: boolean;
  variant?: "neutral" | "correct" | "wrong";
};

export const Example = (props: Props) => {
  const [showTranslation, setShowTranslation] = createSignal(
    props.alwaysShow ?? false,
  );

  return (
    <Card variant="outlined">
      <CardContent class="flex flex-col pt-6">
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
      </CardContent>
    </Card>
  );
};
