import { children, createSignal, For, Show } from "solid-js";
import { Button } from "ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "ui/card";
import {
  TextField,
  TextFieldInput,
  TextFieldLabel,
  TextFieldTextArea,
} from "ui/text-field";
import { StructureDisplay } from "../../components/solid/grammar-point/StructureDisplay";
import {
  Select,
  SelectContainer,
  SelectLabel,
  SelectOption,
} from "packages/ui/select";
import type { JSX } from "solid-js/jsx-runtime";
import { ExplanationDisplay } from "@components/solid/grammar-point/ExplanationDisplay";

interface GrammarPointFormProps {
  initialData?: {
    id: number;
    shortTitle: string;
    detailedTitle?: string;
    englishTitle?: string;
    order: number;
    structure?: string;
    torfl?: string;
    explanation?: string;
  };
  success?: boolean;
  error?: string;
  isLoading?: boolean;
  onSuccess?: () => void;
  children?: JSX.Element;
}

export const GrammarPointForm = (props: GrammarPointFormProps) => {
  const resolved = children(() => props.children);

  const [structure, setStructure] = createSignal<string | undefined>(
    props.initialData?.structure,
  );

  const [explanation, setExplanation] = createSignal<string | undefined>(
    props.initialData?.explanation,
  );

  return (
    <Card variant="outlined">
      <CardHeader>
        <CardTitle>Grammar Point</CardTitle>
      </CardHeader>
      <CardContent class="space-y-6">
        <Show when={props.error}>
          <div class="rounded border border-red-200 bg-red-50 p-3 text-red-800 text-sm">
            {props.error}
          </div>
        </Show>

        <Show when={props.success}>
          <div class="rounded border border-green-200 bg-green-50 p-3 text-green-800 text-sm">
            Grammar point saved successfully!
          </div>
        </Show>

        <div class="grid grid-cols-1 gap-4">
          {props.initialData?.id && (
            <input type="hidden" name="id" value={props.initialData.id} />
          )}
          <TextField>
            <TextFieldLabel>Short Title</TextFieldLabel>
            <TextFieldInput
              type="text"
              name="shortTitle"
              value={props.initialData?.shortTitle}
              required
              placeholder="e.g., Кто ты? Кто я?"
            />
          </TextField>

          <TextField>
            <TextFieldLabel>Detailed Title</TextFieldLabel>
            <TextFieldInput
              type="text"
              name="detailedTitle"
              value={props.initialData?.detailedTitle}
              required
              placeholder="e.g., Личные местоимения"
            />
          </TextField>

          <TextField>
            <TextFieldLabel>English Title</TextFieldLabel>
            <TextFieldInput
              type="text"
              name="englishTitle"
              value={props.initialData?.englishTitle}
              placeholder="e.g., Personal pronouns"
              required
            />
          </TextField>
        </div>

        <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
          <SelectContainer>
            <SelectLabel for="torfl" class="flex flex-col">
              TORFL Level
            </SelectLabel>
            <Select
              id="torfl"
              name="torfl"
              value={props.initialData?.torfl ?? "A1"}
              required
            >
              <For each={["", "A1", "A2", "B1", "B2", "C1", "C2"]}>
                {(level) => (
                  <SelectOption
                    value={level}
                    selected={level === props.initialData?.torfl}
                  >
                    {level === "" ? "Select level" : level}
                  </SelectOption>
                )}
              </For>
            </Select>
          </SelectContainer>
        </div>

        <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <TextField value={structure()} onChange={setStructure}>
              <TextFieldLabel for="structure">Structure{""}</TextFieldLabel>
              <TextFieldTextArea
                id="structure"
                name="structure"
                placeholder="e.g., Кто? Что?"
                rows="4"
              />
            </TextField>

            <p class="mt-1 text-slate-500 text-xs">
              Supports HTML and line breaks
            </p>
          </div>

          <Preview>
            <StructureDisplay structure={structure()} />
          </Preview>
        </div>
        <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <TextField value={explanation()} onChange={setExplanation}>
              <TextFieldLabel for="explanation">Explanation{""}</TextFieldLabel>
              <TextFieldTextArea
                id="explanation"
                name="explanation"
                placeholder="e.g. Представьте себе кролика..."
                rows="4"
              />
            </TextField>

            <p class="mt-1 text-slate-500 text-xs">
              Supports HTML and line breaks
            </p>
          </div>

          <Preview>
            <ExplanationDisplay text={explanation()} />
          </Preview>
        </div>
        <div>{resolved()}</div>

        <div class="flex gap-3 pt-4">
          <Button type="submit" disabled={props.isLoading}>
            {props.isLoading
              ? "Saving..."
              : props.initialData
                ? "Update"
                : "Create"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

const Preview = (props: { children: JSX.Element }) => {
  const resolved = children(() => props.children);
  return (
    <div>
      <p class="mb-2 block font-medium text-slate-700 text-sm">Preview</p>
      {resolved()}
    </div>
  );
};
