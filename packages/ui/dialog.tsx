import { Dialog as KobalteDialog } from "@kobalte/core";
import { type JSX, splitProps } from "solid-js";
import { cn } from "ui/utils";

type DialogProps = {
  title: string;
  description?: string;
  children?: JSX.Element;
  trigger?: JSX.Element;
  footer?: JSX.Element;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  class?: string;
};

export function Dialog(props: DialogProps) {
  const [local, others] = splitProps(props, [
    "title",
    "description",
    "children",
    "trigger",
    "footer",
    "class",
  ]);

  return (
    <KobalteDialog.Root {...others}>
      {local.trigger && (
        <KobalteDialog.Trigger>{local.trigger}</KobalteDialog.Trigger>
      )}
      <KobalteDialog.Portal>
        <KobalteDialog.Overlay class="data-[closed]:fade-out-0 data-[expanded]:fade-in-0 fixed inset-0 z-50 bg-black/50 data-[closed]:animate-out data-[expanded]:animate-in" />
        <div class="fixed inset-0 z-50 flex items-center justify-center">
          <KobalteDialog.Content
            class={cn(
              "data-[closed]:fade-out-0 data-[expanded]:fade-in-0 data-[closed]:zoom-out-95 data-[expanded]:zoom-in-95 data-[closed]:slide-out-to-bottom-[2%] data-[expanded]:slide-in-from-bottom-[2%] max-h-[85vh] w-[90vw] max-w-md rounded-lg bg-white p-6 shadow-lg data-[closed]:animate-out data-[expanded]:animate-in",
              local.class,
            )}
          >
            <div class="mb-4 flex items-start justify-between">
              <div>
                <KobalteDialog.Title class="font-medium text-lg text-secondary">
                  {local.title}
                </KobalteDialog.Title>
                {local.description && (
                  <KobalteDialog.Description class="mt-1 text-gray-500 text-sm">
                    {local.description}
                  </KobalteDialog.Description>
                )}
              </div>
              <KobalteDialog.CloseButton class="ml-4 inline-flex size-6 appearance-none items-center justify-center rounded-full text-gray-400 hover:text-gray-500 focus:outline-none">
                <span class="sr-only">Close</span>
                <svg
                  class="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <title>Close</title>
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </KobalteDialog.CloseButton>
            </div>

            <div class="mb-5">{local.children}</div>

            {local.footer && (
              <div class="flex justify-end gap-3">{local.footer}</div>
            )}
          </KobalteDialog.Content>
        </div>
      </KobalteDialog.Portal>
    </KobalteDialog.Root>
  );
}

export function DialogTrigger(props: {
  children: JSX.Element;
  class?: string;
}) {
  return (
    <KobalteDialog.Trigger class={props.class}>
      {props.children}
    </KobalteDialog.Trigger>
  );
}

export function DialogClose(props: { children?: JSX.Element; class?: string }) {
  return (
    <KobalteDialog.CloseButton class={cn("", props.class)}>
      {props.children}
    </KobalteDialog.CloseButton>
  );
}
