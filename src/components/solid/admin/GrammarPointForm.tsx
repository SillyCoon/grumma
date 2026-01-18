import { createSignal, Show } from "solid-js";
import { Button } from "ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "ui/card";
import { TextField, TextFieldInput, TextFieldLabel } from "ui/text-field";
import { StructureDisplay } from "../grammar-point/StructureDisplay";

interface GrammarPointFormProps {
  initialData?: {
    id: number;
    shortTitle: string;
    detailedTitle?: string;
    englishTitle?: string;
    order: number;
    structure?: string;
    torfl?: string;
  };
  success?: boolean;
  error?: string;
  isLoading?: boolean;
  onSuccess?: () => void;
}

export const GrammarPointForm = (props: GrammarPointFormProps) => {
  const [structure, setStructure] = createSignal<string | undefined>(
    props.initialData?.structure,
  );

  return (
    <Card variant="outlined">
      <CardHeader>
        <CardTitle>
          {props.initialData
            ? "Edit Grammar Point"
            : "Create New Grammar Point"}
        </CardTitle>
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

        <div class="grid grid-cols-1 gap-4 ">
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
          <TextField>
            <TextFieldLabel>Order</TextFieldLabel>
            <TextFieldInput
              type="number"
              name="order"
              value={props.initialData?.order}
              required
              min="1"
            />
          </TextField>

          <label for="torfl" class="flex flex-col">
            TORFL Level{""}
            <select id="torfl" name="torfl" value={props.initialData?.torfl}>
              <option value="A1">A1</option>
              <option value="A2">A2</option>
              <option value="B1">B1</option>
              <option value="B2">B2</option>
              <option value="C1">C1</option>
              <option value="C2">C2</option>
            </select>
          </label>
        </div>

        <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label for="structure" class="mb-2 block font-medium text-sm">
              Structure{""}
              <textarea
                id="structure"
                name="structure"
                value={props.initialData?.structure}
                onInput={(e) =>
                  setStructure((e.target as HTMLTextAreaElement).value)
                }
                placeholder="e.g., Кто? Что?"
                class="w-full rounded-md border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows="4"
              />
            </label>

            <p class="mt-1 text-slate-500 text-xs">
              Grammar structure question (supports HTML and line breaks)
            </p>
          </div>

          {/* Live Preview */}
          <div>
            <p class="mb-2 block font-medium text-slate-700 text-sm">Preview</p>
            <StructureDisplay structure={structure()} />
          </div>
        </div>

        <div class="flex gap-3 pt-4">
          <Button type="submit" disabled={props.isLoading}>
            {props.isLoading
              ? "Saving..."
              : props.initialData
                ? "Update Grammar Point"
                : "Create Grammar Point"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
