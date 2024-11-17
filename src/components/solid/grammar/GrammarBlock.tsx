import { For, type Setter } from "solid-js";
import { GrammarRef } from "./GrammarRef";
import type { GrammarPoint } from "@grammar-sdk";
import { cva } from "class-variance-authority";
import type { Mode } from "./types";

interface GrammarProps {
  torfl: string;
  grammar: GrammarPoint[];
  inReview?: string[];
  mode: Mode;
  setCram?: Setter<string[]>;
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
  const inReviewSet = new Set(props.inReview);
  return (
    <section>
      <div class="z-10 mb-2 flex items-center justify-between bg-white pt-8">
        <h1 class="text-5xl text-foregrounds-primary">{props.torfl}</h1>
      </div>
      <div class={grammarBlockVariant({ mode: props.mode })}>
        <For each={props.grammar}>
          {(gp) => (
            <GrammarRef
              {...gp}
              inReview={!!inReviewSet.has(gp.id)}
              onClick={() =>
                props.setCram?.((v) =>
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
