import type { JSX } from "solid-js";
import { children, createSignal, Match, Switch } from "solid-js";
import { Badge } from "ui/badge";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "ui/card";
import { Checkbox } from "ui/checkbox";
import { Mode } from "./types";

interface GrammarRefProps {
  id: string;
  order?: number;
  shortTitle: string;
  detailedTitle: string;
  englishTitle: string;
  inReview?: boolean;
  mode?: Mode;
  onClick?: () => void;
}

const Wrapper = (props: {
  children: JSX.Element;
  mode: Mode;
  id: string;
}) => {
  const c = children(() => props.children);
  return (
    <Switch fallback={c()}>
      <Match when={props.mode === Mode.cram}>{c()}</Match>
      <Match when={props.mode === Mode.nav}>
        <a href={`/grammar/${props.id}`}>{c()}</a>
      </Match>
    </Switch>
  );
};

export const GrammarRef = (props: GrammarRefProps) => {
  const [selected, setSelected] = createSignal(false);

  return (
    <div>
      <Wrapper mode={props.mode ?? Mode.nav} id={props.id}>
        <Card
          onClick={() => {
            props.onClick?.();
            if (props.mode === Mode.cram) setSelected((s) => !s);
          }}
          class={`min-h-full cursor-pointer transition-all hover:opacity-75 hover:shadow-md active:opacity-100 active:shadow-xs ${props.mode === Mode.cram && "bg-white"}`}
        >
          <CardHeader>
            <div>
              <div>
                <div class="flex items-center justify-between gap-1">
                  <div class="flex items-center gap-2 overflow-x-hidden">
                    {props.mode === Mode.cram && (
                      <Checkbox checked={selected()} />
                    )}
                    <CardTitle class="overflow-x-hidden text-ellipsis whitespace-nowrap">
                      {props.shortTitle}
                    </CardTitle>
                  </div>

                  {props.inReview && (
                    <Badge variant="success" class="min-w-[77px]">
                      In review
                    </Badge>
                  )}
                </div>

                <CardDescription>{props.detailedTitle}</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardFooter class="mt-auto">
            <p>{props.englishTitle}</p>
          </CardFooter>
        </Card>
      </Wrapper>
    </div>
  );
};
