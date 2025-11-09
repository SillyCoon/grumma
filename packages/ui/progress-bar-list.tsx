import type { ComponentProps, JSX } from "solid-js";
import { For, mergeProps, Show, splitProps } from "solid-js";
import { Dynamic } from "solid-js/web";

import { cn } from "ui/utils";

type Bar<
  T,
  BarType extends "relative" | "progress",
  Total = BarType extends "relative"
    ? { total?: undefined }
    : { total: number },
> = T & {
  value: number;
  id: string;
  name: JSX.Element;
  icon?: (props: ComponentProps<"svg">) => JSX.Element;
  href?: string;
  target?: string;
} & Total;

type SortOrder = "ascending" | "descending" | "none";

type ValueFormatter = (
  value: number,
  total: number | undefined,
  id: string,
) => string;

const defaultValueFormatter: ValueFormatter = (
  value: number,
  total?: number,
) => (total ? `${value}/${total}` : `${value}`);

type BarListProps<
  T,
  BarType extends "relative" | "progress",
> = ComponentProps<"div"> & {
  data: Bar<T, BarType>[];
  valueFormatter?: ValueFormatter;
  sortOrder?: SortOrder;
  width: BarType;
};

const BarList = <T, BarType extends "relative" | "progress">(
  rawProps: BarListProps<T, BarType>,
) => {
  const props = mergeProps(
    {
      valueFormatter: defaultValueFormatter,
      sortOrder: "descending" as SortOrder,
    },
    rawProps,
  );
  const [local, others] = splitProps(props, [
    "class",
    "data",
    "valueFormatter",
    "sortOrder",
    "width",
  ]);

  const sortedData = () => {
    if (local.sortOrder === "none") {
      return local.data;
    }
    return local.data.sort((a, b) =>
      local.sortOrder === "ascending" ? a.value - b.value : b.value - a.value,
    );
  };

  const relativeWidths = () => {
    const maxValue = Math.max(...sortedData().map((item) => item.value), 0);

    return sortedData().map((item) =>
      item.value === 0 ? 0 : Math.max((item.value / maxValue) * 100, 2),
    );
  };

  const progressWidths = () => {
    return sortedData().map((item) =>
      item.value === 0
        ? 0
        : Math.max((item.value / (item.total ?? 0)) * 100, 2),
    );
  };

  const widths = () =>
    local.width === "relative" ? relativeWidths() : progressWidths();

  return (
    <div class={cn("flex flex-col space-y-1.5", local.class)} {...others}>
      <For each={sortedData()}>
        {(bar, idx) => {
          return (
            <div class="row flex w-full justify-between space-x-6">
              <div class="grow">
                <div
                  class={cn(
                    "flex h-8 items-center rounded-md bg-secondary px-2 text-primary-foreground",
                  )}
                  style={{
                    width: `${widths()[idx()]}%`,
                  }}
                >
                  <Show when={bar.icon}>
                    {(icon) => (
                      <Dynamic
                        component={icon()}
                        class="mr-2 size-5 flex-none"
                      />
                    )}
                  </Show>
                  <Show when={bar.href} fallback={<p>{bar.name}</p>}>
                    {(href) => (
                      <a
                        href={href()}
                        target={bar.target ?? "_blank"}
                        rel="noreferrer"
                        class="hover:underline"
                      >
                        {bar.name}
                      </a>
                    )}
                  </Show>
                </div>
              </div>
              <div class="flex items-center text-foregrounds-primary">
                {local.valueFormatter(bar.value, bar.total, bar.id)}
              </div>
            </div>
          );
        }}
      </For>
    </div>
  );
};

export { BarList };
