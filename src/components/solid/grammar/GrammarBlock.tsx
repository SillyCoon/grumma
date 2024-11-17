import { createSignal, For } from "solid-js";
import { GrammarRef } from "./GrammarRef";
import type { GrammarPoint } from "@grammar-sdk";
import { cva } from "class-variance-authority";
import { Button } from "@components/ui/button";
import type { Mode } from "./types";

interface GrammarProps {
  torfl: string;
  grammar: GrammarPoint[];
  inReview?: string[];
  mode: Mode;
}

const grammarBlockVariant = cva("grid grid-cols-1 gap-4", {
  variants: {
    mode: {
      nav: "md:grid-cols-2 lg:grid-cols-2",
      cram: "md:grid-cols-1 lg:grid-cols-1",
    },
  },
});

export const GrammarBlock = (props: GrammarProps) => {
  const [cram, setCram] = createSignal<string[]>([]);

  const inReviewSet = new Set(props.inReview);
  return (
    <section>
      <div class="sticky top-[calc(76px)] z-10 mb-2 flex items-center justify-between bg-white pt-8">
        <h1 class="text-5xl text-foregrounds-primary">{props.torfl}</h1>
        {props.mode === "cram" && (
          <a href={`grammar/${cram().join("-")}/practice`}>
            <Button>Start</Button>
          </a>
        )}
      </div>
      <div class={grammarBlockVariant({ mode: props.mode })}>
        <For each={props.grammar}>
          {(gp) => (
            <GrammarRef
              {...gp}
              inReview={!!inReviewSet.has(gp.id)}
              onClick={() =>
                setCram((v) =>
                  v.includes(gp.id)
                    ? v.filter((id) => id !== gp.id)
                    : [...v, gp.id],
                )
              }
              mode={props.mode}
            />
          )}
        </For>
      </div>
    </section>
  );
};
