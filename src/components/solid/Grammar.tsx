import { For } from "solid-js";
import type { GrammarPoint } from "@grammar-sdk";
import { GrammarBlock } from "./GrammarBlock";

interface GrammarProps {
  grammar: GrammarPoint[];
  inReview?: string[];
}

export const Grammar = (props: GrammarProps) => {
  const groupedGrammar = Object.groupBy(props.grammar, (v) => v.torfl);
  return (
    <section class="grid gap-5">
      <For each={Object.entries(groupedGrammar)}>
        {([torfl, grammar]) =>
          grammar?.length && (
            <GrammarBlock
              torfl={torfl}
              grammar={grammar ?? []}
              inReview={props.inReview}
            />
          )
        }
      </For>
    </section>
  );
};
