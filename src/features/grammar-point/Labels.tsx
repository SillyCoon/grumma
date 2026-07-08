import { Badge } from "packages/ui/badge";
import { Button } from "packages/ui/button";
import { HtmlCheckbox } from "packages/ui/html-checkbox";
import { createResource, createSignal, For } from "solid-js";
import styles from "./Labels.module.css";
import {
  TextField,
  TextFieldInput,
  TextFieldLabel,
} from "packages/ui/text-field";
import { actions } from "astro:actions";
import toast from "solid-toast";
import { isServer } from "solid-js/web";
import type { Label } from "grammar-sdk";

const LabelChip = (props: { children: string; color: string }) => {
  return (
    <Badge customColor={props.color} round>
      {props.children}
    </Badge>
  );
};

export const Labels = (props: {
  selected: number[];
  onAssign: (allLabelIds: number[]) => Promise<void>;
}) => {
  const [rawSearch, setSearch] = createSignal("");
  const search = () => rawSearch().trim();

  const [selected, setSelected] = createSignal<number[]>(props.selected);
  const [assigning, setAssigning] = createSignal(false);

  const [labels, { mutate }] = createResource(
    () => !isServer,
    async () => {
      const labels = await actions.getLabels();
      if (labels.error) {
        toast.error(`Failed to fetch labels: ${labels.error.message}`);
        return [];
      }
      return labels.data ?? [];
    },
  );

  const filteredLabels = () =>
    labels()?.filter((label) =>
      label.name.toLowerCase().includes(search().toLowerCase()),
    ) ?? [];

  const searchedExisting = () =>
    labels()?.some(
      (label) => label.name.toLowerCase() === search().toLowerCase(),
    ) ?? false;

  return (
    <div class="items-center-safe inline-flex flex-row gap-1">
      <Button variant="ghost" popovertarget="labels-menu">
        Edit Labels
      </Button>
      <div id="labels-menu" class={styles.labelsMenu} popover>
        <div class="flex flex-col gap-3">
          <TextField onChange={(e) => setSearch(e)}>
            <TextFieldLabel>Search labels</TextFieldLabel>
            <TextFieldInput type="text" />
          </TextField>
          <div class="flex flex-col gap-2">
            <For each={filteredLabels()}>
              {(label) => (
                <div class="flex items-center gap-2">
                  <HtmlCheckbox
                    onChange={async (e) => {
                      if (assigning()) return;
                      const prev = selected();
                      const result = setSelected((prev) => {
                        if (e.target.checked) {
                          return [...prev, label.id];
                        }
                        return prev.filter((id) => id !== label.id);
                      });
                      setAssigning(true);
                      try {
                        await props.onAssign(result);
                        toast.success("Labels updated successfully!");
                      } catch {
                        toast.error(
                          "Failed to update labels. Please try again.",
                        );
                        setSelected(prev);
                      } finally {
                        setAssigning(false);
                      }
                    }}
                    name="labels[]"
                    value={label.id}
                    id={`label-${label.id}`}
                    checked={selected().includes(label.id)}
                    disabled={assigning()}
                  />
                  <LabelChip color={label.color}>{label.name}</LabelChip>
                </div>
              )}
            </For>

            <Button
              variant="ghost"
              type="button"
              disabled={searchedExisting() || search() === ""}
              onClick={async () => {
                const label = await actions.createLabel({ name: search() });
                if (label.error) {
                  toast.error(`Failed to create label: ${label.error.message}`);
                  return;
                }
                const newLabel = label.data;
                if (newLabel) {
                  mutate((prev) => [...(prev ?? []), newLabel]);
                  setSearch("");
                }
              }}
            >
              + Create label {searchedExisting() ? "(already exists)" : ""}
            </Button>
          </div>
        </div>
      </div>
      <LabelsList
        labels={
          labels()?.filter((label) => selected().includes(label.id)) ?? []
        }
      />
    </div>
  );
};

const LabelsList = (props: { labels: Label[] }) => {
  return (
    <div class="flex flex-row flex-wrap gap-1">
      <For each={props.labels}>
        {(label) => <LabelChip color={label.color}>{label.name}</LabelChip>}
      </For>
    </div>
  );
};
