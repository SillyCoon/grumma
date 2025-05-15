import type { GrammarPoint } from "grammar-sdk";
import { Search } from "packages/ui/icons";
import { createSignal, For } from "solid-js";
import { useDebounce } from "solid-utils";
import { Button } from "ui/button";
import { TextField, TextFieldInput } from "ui/text-field";
import { GrammarBlock } from "./GrammarBlock";

interface GrammarProps {
  grammar: GrammarPoint[];
  inReview?: string[];
  mode: "nav" | "cram";
}

export const Grammar = (props: GrammarProps) => {
  const [cram, setCram] = createSignal<string[]>([]);
  const [filter, setFilter] = createSignal<string>("");
  const debouncedFilter = useDebounce(
    (v: string) => setFilter(v.toLowerCase()),
    300,
  );

  const filteredGrammar = () =>
    props.grammar.filter((gp) => {
      return (
        gp.shortTitle.toLowerCase().includes(filter()) ||
        gp.detailedTitle?.toLowerCase?.()?.includes?.(filter()) ||
        gp.englishTitle?.toLowerCase?.()?.includes?.(filter())
      );
    });

  const cramDisabled = () => !cram().length;

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
            <a
              href={
                cramDisabled()
                  ? undefined
                  : `grammar/${cram().join("-")}/practice`
              }
            >
              <Button disabled={cramDisabled()}>Start</Button>
            </a>
          </div>
        </div>
      )}
      <TextField
        class="relative mt-10 mb-2 flex flex-col gap-1"
        onChange={debouncedFilter}
      >
        <Search class="absolute top-2.5 left-2 size-5 fill-secondary focus:outline-primary" />
        <TextFieldInput
          class="pl-8"
          name="search"
          type="search"
          placeholder="Search"
        />
      </TextField>
      <For each={Object.entries(groupedGrammar)}>
        {([torfl, grammar]) =>
          grammar?.length && (
            <GrammarBlock
              torfl={torfl}
              grammar={filteredGrammar()}
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
