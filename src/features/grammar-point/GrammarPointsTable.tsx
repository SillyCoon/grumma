import { For } from "solid-js";
import type { GrammarPoint } from "./domain";
import { useDragAndDrop } from "@formkit/drag-and-drop/solid";
import { Button } from "packages/ui/button";
import { cn } from "packages/ui/utils";

export const GrammarPointsTable = (props: {
  grammarPoints: GrammarPoint[];
}) => {
  const [parent, points] = useDragAndDrop<HTMLTableRowElement, GrammarPoint>(
    props.grammarPoints,
  );

  return (
    <div>
      <div class="flex flex-row justify-between">
        <h2 class="mb-4 font-semibold text-2xl">
          Existing Grammar Points ({props.grammarPoints.length})
        </h2>
        <Button>Save order</Button>
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
          </tbody>
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
