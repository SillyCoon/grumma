import { Badge } from "@components/ui/badge";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@components/ui/card";
import { Checkbox } from "@components/ui/checkbox";
import { children, createSignal, Match, Switch } from "solid-js";
import type { JSX } from "solid-js";
import { Mode } from "./types";

interface GrammarRefProps {
  id: string;
  order?: number;
  title: string;
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

  const [mainTitle, detailedTitle, enTitle] = props.title.split("/") as [
    string,
    string,
    string,
  ];

  return (
    <div>
      <Wrapper mode={props.mode ?? Mode.nav} id={props.id}>
        <Card
          onClick={() => {
            props.onClick?.();
            if (props.mode === Mode.cram) setSelected((s) => !s);
          }}
          class={`min-h-full cursor-pointer transition-all hover:opacity-75 hover:shadow-md active:opacity-100 active:shadow-sm ${props.mode === Mode.cram && "bg-white"}`}
        >
          <CardHeader>
            <div>
              <div>
                <div class="flex items-center justify-between gap-1">
                  <div class="flex items-center gap-2 overflow-x-hidden">
                    {props.mode === Mode.cram && (
                      <Checkbox checked={selected()} onChange={setSelected} />
                    )}
                    <CardTitle class="overflow-x-hidden text-ellipsis whitespace-nowrap">
                      {mainTitle}
                    </CardTitle>
                  </div>

                  {props.inReview && (
                    <Badge variant="success" class="min-w-[77px]">
                      In review
                    </Badge>
                  )}
                </div>

                <CardDescription>{detailedTitle}</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardFooter class="mt-auto">
            <p>{enTitle}</p>
          </CardFooter>
        </Card>
      </Wrapper>
    </div>
  );
};
