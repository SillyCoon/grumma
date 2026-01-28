import { createSignal, For } from "solid-js";
import type { GrammarPoint } from "./domain";
import { useDragAndDrop } from "@formkit/drag-and-drop/solid";
import { Button } from "packages/ui/button";
import { cn } from "packages/ui/utils";
import { actions } from "astro:actions";
import { toast } from "solid-toast";
import { SaveConfirmation } from "@components/common/SaveConfirmation";

export const GrammarPointsTable = (props: {
  grammarPoints: GrammarPoint[];
  error?: string;
}) => {
  const [parent, points, setPoints] = useDragAndDrop<
    HTMLTableRowElement,
    GrammarPoint
  >(props.grammarPoints, {
    draggable: (el) => el.id !== "non-draggable",
  });

  if (props.error) {
    toast.error(props.error);
  }

  const [newPoints, setNewPoints] = createSignal<string[]>([]);

  const addNewPoint = () => {
    setNewPoints([...newPoints(), "New grammar point"]);
  };

  const updatePoint = (index: number, value: string) => {
    const updated = [...newPoints()];
    updated[index] = value;
    setNewPoints(updated);
  };

  const updateOrder = async () => {
    try {
      const response = await actions.updateGrammarPointsOrder(
        points().map((gp, index) => ({
          id: gp.id,
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
          Existing Grammar Points ({props.grammarPoints.length})
        </h2>
        <SaveConfirmation title="grammar points order" onSave={updateOrder}>
          <Button
            disabled={!points().some((gp, index) => gp.order !== index + 1)}
          >
            Save Order
          </Button>
        </SaveConfirmation>
      </div>
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
              <th class="px-6 py-3 text-center font-semibold text-slate-900">
                Actions
              </th>
            </tr>
          </thead>
          <tbody ref={parent}>
            <For each={points()}>
              {(gp, order) => {
                const differentOrder = () => gp.order !== order() + 1;
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
              {(gp, index) => (
                <tr class="border-b bg-green-50" id="non-draggable">
                  <td class="px-6 py-3 font-medium text-slate-900">New</td>
                  <td class="px-6 py-3 text-slate-700" colSpan={4}>
                    <form
                      id={`new-point-form-${index()}`}
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
                        id="shortTitle"
                        name="shortTitle"
                        ref={(el) => {
                          const isLast = index() === newPoints().length - 1;
                          isLast && el.focus({ preventScroll: false });
                        }}
                        onChange={(e) => updatePoint(index(), e.target.value)}
                        class="w-full"
                        value={gp}
                      />
                    </form>
                  </td>

                  <td class="px-6 py-3 text-center">
                    <button
                      type="submit"
                      form={`new-point-form-${index()}`}
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
              <td class="px-6 py-3 text-slate-700" colSpan={6}>
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

        {props.grammarPoints.length === 0 && (
          <div class="px-6 py-12 text-center text-slate-500">
            <p>No grammar points yet. Create one using the form above!</p>
          </div>
        )}
      </div>
    </div>
  );
};
