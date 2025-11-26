import { actions } from "astro:actions";
import { createSignal, Show } from "solid-js";
import { Button } from "ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "ui/card";
import {
  TextField,
  TextFieldInput,
  TextFieldLabel,
  TextFieldDescription,
} from "ui/text-field";
import { StructureDisplay } from "../grammar-point/StructureDisplay";

interface GrammarPointFormProps {
  initialData?: {
    id: number;
    shortTitle: string;
    title: string;
    order: number;
    structure?: string;
    detailedTitle?: string;
    englishTitle?: string;
    torfl?: string;
  };
  onSuccess?: () => void;
}

export const GrammarPointForm = (props: GrammarPointFormProps) => {
  const [formData, setFormData] = createSignal({
    shortTitle: props.initialData?.shortTitle ?? "",
    title: props.initialData?.title ?? "",
    order: (props.initialData?.order ?? 1).toString(),
    structure: props.initialData?.structure ?? "",
    detailedTitle: props.initialData?.detailedTitle ?? "",
    englishTitle: props.initialData?.englishTitle ?? "",
    torfl: props.initialData?.torfl ?? "",
  });

  const [isLoading, setIsLoading] = createSignal(false);
  const [error, setError] = createSignal<string | null>(null);
  const [success, setSuccess] = createSignal(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    setError(null);
    setSuccess(false);
  };

  const handleSubmit = async (e: Event) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const submitData = {
        shortTitle: formData().shortTitle,
        title: formData().title,
        order: Number.parseInt(formData().order),
        structure: formData().structure || undefined,
        detailedTitle: formData().detailedTitle || undefined,
        englishTitle: formData().englishTitle || undefined,
        torfl: formData().torfl || undefined,
      };

      if (props.initialData) {
        // Update
        await actions.updateGrammarPoint({
          id: props.initialData.id,
          ...submitData,
        });
      } else {
        // Create
        await actions.createGrammarPoint(submitData);
      }

      setSuccess(true);
      if (props.onSuccess) {
        props.onSuccess();
      }

      // Reset form only for new grammar points
      if (!props.initialData) {
        setFormData({
          shortTitle: "",
          title: "",
          order: "1",
          structure: "",
          detailedTitle: "",
          englishTitle: "",
          torfl: "",
        });
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to save grammar point",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card variant="outlined">
      <CardHeader>
        <CardTitle>
          {props.initialData
            ? "Edit Grammar Point"
            : "Create New Grammar Point"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} class="space-y-6">
          <Show when={error()}>
            <div class="rounded border border-red-200 bg-red-50 p-3 text-red-800 text-sm">
              {error()}
            </div>
          </Show>

          <Show when={success()}>
            <div class="rounded border border-green-200 bg-green-50 p-3 text-green-800 text-sm">
              Grammar point saved successfully!
            </div>
          </Show>

          {/* Required Fields */}
          <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
            <TextField>
              <TextFieldLabel>Short Title</TextFieldLabel>
              <TextFieldInput
                type="text"
                name="shortTitle"
                value={formData().shortTitle}
                onInput={(e) =>
                  handleInputChange("shortTitle", e.currentTarget.value)
                }
                required
                placeholder="e.g., nominative"
              />
              <TextFieldDescription>
                Used as identifier (no spaces)
              </TextFieldDescription>
            </TextField>

            <TextField>
              <TextFieldLabel>Full Title</TextFieldLabel>
              <TextFieldInput
                type="text"
                name="title"
                value={formData().title}
                onInput={(e) =>
                  handleInputChange("title", e.currentTarget.value)
                }
                required
                placeholder="e.g., Nominative Case (Именительный падеж)"
              />
            </TextField>
          </div>

          <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
            <TextField>
              <TextFieldLabel>Order</TextFieldLabel>
              <TextFieldInput
                type="number"
                name="order"
                value={formData().order}
                onInput={(e) =>
                  handleInputChange("order", e.currentTarget.value)
                }
                required
                min="1"
              />
            </TextField>

            <TextField>
              <TextFieldLabel>TORFL Level</TextFieldLabel>
              <TextFieldInput
                type="text"
                name="torfl"
                value={formData().torfl}
                onInput={(e) =>
                  handleInputChange("torfl", e.currentTarget.value)
                }
                placeholder="e.g., A1, A2, B1"
              />
              <TextFieldDescription>
                Russian language proficiency level
              </TextFieldDescription>
            </TextField>
          </div>

          {/* Structure Field with Live Preview */}
          <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label for="structure" class="mb-2 block font-medium text-sm">
                Structure
              </label>
              <textarea
                id="structure"
                value={formData().structure}
                onInput={(e) =>
                  handleInputChange("structure", e.currentTarget.value)
                }
                placeholder="e.g., Кто? Что?"
                class="w-full rounded-md border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows="4"
              />
              <p class="mt-1 text-slate-500 text-xs">
                Grammar structure question (supports HTML and line breaks)
              </p>
            </div>

            {/* Live Preview */}
            <div>
              <p class="mb-2 block font-medium text-slate-700 text-sm">
                Preview
              </p>
              <StructureDisplay structure={formData().structure} />
            </div>
          </div>

          {/* Optional Fields */}
          <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
            <TextField>
              <TextFieldLabel>Detailed Title (Russian)</TextFieldLabel>
              <TextFieldInput
                type="text"
                name="detailedTitle"
                value={formData().detailedTitle}
                onInput={(e) =>
                  handleInputChange("detailedTitle", e.currentTarget.value)
                }
                placeholder="e.g., The Case of the Subject"
              />
            </TextField>

            <TextField>
              <TextFieldLabel>English Title</TextFieldLabel>
              <TextFieldInput
                type="text"
                name="englishTitle"
                value={formData().englishTitle}
                onInput={(e) =>
                  handleInputChange("englishTitle", e.currentTarget.value)
                }
                placeholder="e.g., Who? What?"
              />
            </TextField>
          </div>

          {/* Form Actions */}
          <div class="flex gap-3 pt-4">
            <Button type="submit" disabled={isLoading()}>
              {isLoading()
                ? "Saving..."
                : props.initialData
                  ? "Update Grammar Point"
                  : "Create Grammar Point"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                if (!props.initialData) {
                  setFormData({
                    shortTitle: "",
                    title: "",
                    order: "1",
                    structure: "",
                    detailedTitle: "",
                    englishTitle: "",
                    torfl: "",
                  });
                }
              }}
            >
              Reset
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
