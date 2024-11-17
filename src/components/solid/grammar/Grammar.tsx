import { For, Match, Switch } from "solid-js";
import type { GrammarPoint } from "@grammar-sdk";
import { FabButton } from "@components/ui/fab";
import { OppositeMode } from "./types";
import { GrammarBlock } from "./GrammarBlock";
import { CloseIcon, AddIcon } from "@components/icons";

interface GrammarProps {
  grammar: GrammarPoint[];
  inReview?: string[];
  mode: "nav" | "cram";
}

export const Grammar = (props: GrammarProps) => {
  const groupedGrammar = Object.groupBy(props.grammar, (v) => v.torfl);
  return (
    <section class="grid">
      {props.mode === "cram" && (
        <h2 class="mt-8 text-3xl text-secondary">
          Select grammar points to practice:
        </h2>
      )}
      <For each={Object.entries(groupedGrammar)}>
        {([torfl, grammar]) =>
          grammar?.length && (
            <GrammarBlock
              torfl={torfl}
              grammar={grammar ?? []}
              inReview={props.inReview}
              mode={props.mode}
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
