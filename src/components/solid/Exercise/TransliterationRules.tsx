import { createSignal, For } from "solid-js";
import { Button } from "ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "ui/sheet";
import { substitutions } from "utils/translit";

export const TransliterationRules = () => {
  const [isOpen, setIsOpen] = createSignal(false);

  return (
    <Sheet modal={false} onOpenChange={(e) => setIsOpen(e)}>
      <SheetTrigger>
        <Button variant="ghost">
          Transliteration rules{isOpen() ? " [esc]" : ""}
        </Button>
      </SheetTrigger>
      <SheetContent
        onInteractOutside={(e) => e.preventDefault()}
        overlay={false}
        position="bottom"
      >
        <SheetHeader>
          <SheetTitle>Transliteration rules (latin → cyrillic) </SheetTitle>
          <SheetDescription>
            <TransliterationTable rules={substitutions} />
          </SheetDescription>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
};

const TransliterationTable = (props: { rules: Record<string, string> }) => {
  return (
    <div class="grid grid-cols-3 gap-2 sm:grid-cols-6 md:grid-cols-10 lg:grid-cols-12">
      <For each={Object.entries(props.rules)}>
        {([transliteration, original]) => (
          <div class="col-span-1 rounded-lg border border-gray-300 p-2 text-center">
            <span class="text-primary">{transliteration}</span> →{" "}
            <span class="text-secondary">{original}</span>
          </div>
        )}
      </For>
    </div>
  );
};
