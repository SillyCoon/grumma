import { createSignal, For, Match, Switch } from "solid-js";
import type { GrammarPoint } from "@grammar-sdk";
import { FabButton } from "@components/ui/fab";
import { OppositeMode } from "./types";
import { GrammarBlock } from "./GrammarBlock";
import { CloseIcon, AddIcon } from "@components/icons";
import { Button } from "@components/ui/button";

interface GrammarProps {
  grammar: GrammarPoint[];
  inReview?: string[];
  mode: "nav" | "cram";
}

export const Grammar = (props: GrammarProps) => {
  const [cram, setCram] = createSignal<string[]>([]);

  const groupedGrammar = Object.groupBy(props.grammar, (v) => v.torfl);
  return (
    <section class="grid">
      {props.mode === "cram" && (
        <div class="sticky top-[calc(76px)] z-10 mb-2 flex items-center justify-between bg-white pt-8">
          <h1 class="text-3xl text-secondary">
            Select grammar points to practice:
          </h1>

          <div class="flex items-center gap-2">
            <span>Selected: {cram().length}</span>
            <a href={`grammar/${cram().join("-")}/practice`}>
              <Button>Start</Button>
            </a>
          </div>
        </div>
      )}
      <For each={Object.entries(groupedGrammar)}>
        {([torfl, grammar]) =>
          grammar?.length && (
            <GrammarBlock
              torfl={torfl}
              grammar={grammar ?? []}
              inReview={props.inReview}
              mode={props.mode}
              setCram={setCram}
            />
          )
        }
      </For>
      <FabButton href={`/grammar?mode=${OppositeMode[props.mode]}`}>
        <Switch>
          <Match when={props.mode === "nav"}>
            <AddIcon />
          </Match>
          <Match when={props.mode === "cram"}>
            <CloseIcon />
          </Match>
        </Switch>
      </FabButton>
    </section>
  );
};
