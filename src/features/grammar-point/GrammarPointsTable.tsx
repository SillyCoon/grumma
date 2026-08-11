import { createEffect, createSignal, For } from "solid-js";
import { useDragAndDrop } from "@formkit/drag-and-drop/solid";
import { Button } from "ui/button";
import { cn } from "ui/utils";
import { actions } from "astro:actions";
import { toast } from "solid-toast";
import { SaveConfirmation } from "@components/common/SaveConfirmation";
import type { GrammarPoint } from "grammar-sdk";
import type { Label } from "grammar-sdk";
import { Badge } from "ui/badge";
import { TextField, TextFieldInput } from "ui/text-field";
import { searchGrammar } from "./search";
import { IconButton } from "ui/icon-button";
import { Search } from "ui/icons";
import { GrammarPointWithLabels } from "./type";

export const GrammarPointsTable = (props: {
  grammarPoints: GrammarPoint[];
  labels: Label[];
  error?: string;
}) => {
  const grammarPoints = () =>
    GrammarPointWithLabels(props.grammarPoints, props.labels);

  const [rawSearch, setSearch] = createSignal("");
  const search = () => rawSearch().toLowerCase().trim();
  const sortEnabled = () => search() === "";

  const [parent, rawPoints, setPoints, updateConfig] = useDragAndDrop<
    HTMLTableRowElement,
    GrammarPointWithLabels
  >(grammarPoints(), {
    draggable: (el) => el.id !== "non-draggable",
  });

  const points = () =>
    search() ? searchGrammar(rawPoints(), search()) : rawPoints();

  createEffect(() => {
    updateConfig({ disabled: !sortEnabled() });
  });

  if (props.error) {
    toast.error(props.error);
  }

  const [newPoints, setNewPoints] = createSignal<string[]>([]);

  const addNewPoint = () => {
    setNewPoints([...newPoints(), ""]);
  };

  const updateOrder = async () => {
    try {
      const response = await actions.updateGrammarPointsOrder(
        points().map((gp, index) => ({
          id: +gp.id,
          order: index + 1,
        })),
      );
      if (response.error) {
        toast.error(
          `Failed to update order: ${
            response.error?.message ?? "Unknown error"
          }`,
        );
      } else {
        setPoints((points) =>
          points.map((gp, index) => ({ ...gp, order: index + 1 })),
        );
        toast.success("Order updated successfully");
      }
    } catch (error) {
      toast.error(
        `Failed to update order: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
      );
    }
  };

  return (
    <div>
      <div class="flex flex-row justify-between">
        <h2 class="mb-4 font-semibold text-2xl">
          Existing Grammar Points ({grammarPoints().length})
        </h2>
        <SaveConfirmation title="grammar points order" onSave={updateOrder}>
          <Button
            disabled={
              !sortEnabled() ||
              !points().some((gp, index) => gp.order !== index + 1)
            }
          >
            Save Order
          </Button>
        </SaveConfirmation>
      </div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const data = new FormData(e.currentTarget);
          const search = data.get("search")?.toString() ?? "";
          setSearch(search);
        }}
      >
        <TextField
          class="my-4 flex flex-row items-center gap-2"
          onChange={(v) => !v.length && setSearch("")}
        >
          <TextFieldInput
            name="search"
            type="search"
            placeholder="Search grammar points..."
          />
          <IconButton type="submit">
            <Search />
          </IconButton>
        </TextField>
      </form>

      <div class="overflow-hidden rounded-lg border border-slate-200 bg-white">
        <table class="w-full text-sm">
          <thead>
            <tr class="border-b bg-slate-50">
              <th class="px-6 py-3 text-left font-semibold text-slate-900">
                Order
              </th>
              <th class="px-6 py-3 text-left font-semibold text-slate-900">
                Short Title
              </th>
              <th class="px-6 py-3 text-left font-semibold text-slate-900">
                Detailed Title
              </th>
              <th class="px-6 py-3 text-left font-semibold text-slate-900">
                English Title
              </th>
              <th class="px-6 py-3 text-left font-semibold text-slate-900">
                TORFL
              </th>
              <th class="px-6 py-3 text-left font-semibold text-slate-900">
                Labels
              </th>
              <th class="px-6 py-3 text-center font-semibold text-slate-900">
                Actions
              </th>
            </tr>
          </thead>
          <tbody ref={parent}>
            <For each={points()}>
              {(gp, index) => {
                const order = () => (sortEnabled() ? index() : gp.order - 1);

                const differentOrder = () =>
                  sortEnabled() && gp.order !== order() + 1;
                return (
                  <tr
                    class="cursor-grab border-b transition hover:bg-slate-50 active:cursor-grabbing"
                    data-label={gp.id}
                  >
                    <td
                      class={cn([
                        "px-6 py-3 font-medium text-slate-900",
                        {
                          "text-warning": differentOrder(),
                        },
                      ])}
                    >
                      {order() + 1} {differentOrder() && `(was ${gp.order})`}
                    </td>
                    <td class="px-6 py-3 text-slate-700">{gp.shortTitle}</td>
                    <td class="px-6 py-3 text-slate-700">{gp.detailedTitle}</td>
                    <td class="px-6 py-3 text-slate-700">{gp.englishTitle}</td>
                    <td class="px-6 py-3">
                      {gp.torfl ? (
                        <span class="inline-block rounded bg-blue-100 px-2 py-1 font-medium text-blue-800 text-xs">
                          {gp.torfl}
                        </span>
                      ) : (
                        <span class="text-slate-400 text-xs">—</span>
                      )}
                    </td>
                    <td class="flex max-w-xs flex-row flex-wrap gap-1 px-6 py-3">
                      <For each={gp.labels}>
                        {(label) => {
                          if (!label) return null;
                          return (
                            <Badge customColor={label.color}>
                              {label.name}
                            </Badge>
                          );
                        }}
                      </For>
                      {}
                    </td>
                    <td class="px-6 py-3 text-center">
                      <a
                        href={`/admin/grammar/${gp.id}`}
                        class="inline-block font-medium text-blue-600 text-xs hover:underline"
                      >
                        Edit
                      </a>
                    </td>
                  </tr>
                );
              }}
            </For>
            <For each={newPoints()}>
              {(gp) => (
                <tr class="border-b bg-green-50" id="non-draggable">
                  <td class="px-6 py-3 font-medium text-slate-900">New</td>
                  <td class="px-6 py-3 text-slate-700" colSpan={5}>
                    <form
                      id="new-point-form"
                      method="post"
                      action={actions.createGrammarPoint}
                    >
                      <input
                        id="detailedTitle"
                        name="detailedTitle"
                        type="hidden"
                        value="-"
                      />
                      <input
                        id="englishTitle"
                        name="englishTitle"
                        type="hidden"
                        value="-"
                      />
                      <input
                        required
                        id="shortTitle"
                        name="shortTitle"
                        placeholder="New grammar point"
                        class="w-full"
                        value={gp}
                      />
                    </form>
                  </td>

                  <td class="px-6 py-3 text-center">
                    <button
                      form="new-point-form"
                      type="submit"
                      class="inline-block cursor-pointer font-medium text-blue-600 text-xs hover:underline"
                    >
                      Save
                    </button>
                  </td>
                </tr>
              )}
            </For>
          </tbody>
          <tfoot>
            <tr>
              <td class="px-6 py-3 text-slate-700" colSpan={7}>
                <Button
                  variant="ghost"
                  disabled={newPoints().length > 0}
                  onClick={addNewPoint}
                >
                  + Quick Create
                </Button>
              </td>
            </tr>
          </tfoot>
        </table>

        {!grammarPoints().length && (
          <div class="px-6 py-12 text-center text-slate-500">
            <p>No grammar points yet. Create one using the form above!</p>
          </div>
        )}
      </div>
    </div>
  );
};
