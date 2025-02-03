import type { GrammarPoint } from "grammar-sdk";
import { createSignal, For } from "solid-js";
import { Button } from "ui/button";
import { GrammarBlock } from "./GrammarBlock";

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
        <div class="sticky top-[calc(76px)] z-10 mb-2 flex flex-wrap items-center justify-between gap-3 bg-white pt-8">
          <h1 class="text-3xl text-secondary">
            Select grammar points to practice:
          </h1>

          <div class="flex w-full items-center justify-between gap-2 md:w-max">
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
    </section>
  );
};
