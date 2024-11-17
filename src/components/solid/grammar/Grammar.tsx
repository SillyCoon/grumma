import { For } from "solid-js";
import type { GrammarPoint } from "@grammar-sdk";
import { FabButton } from "@components/ui/fab";
import { AddIcon } from "@components/icons/Add";
import { OppositeMode } from "./types";
import { GrammarBlock } from "./GrammarBlock";

interface GrammarProps {
  grammar: GrammarPoint[];
  inReview?: string[];
  mode: "nav" | "cram";
}

export const Grammar = (props: GrammarProps) => {
  const groupedGrammar = Object.groupBy(props.grammar, (v) => v.torfl);
  return (
    <section class="grid">
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
        <AddIcon />
      </FabButton>
    </section>
  );
};
