import type { Exercise } from "grammar-sdk/exercise";
import type { JSXElement } from "solid-js";
import { createSignal } from "solid-js";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "ui/sheet";
import { FeedbackForm } from "./FeedbackForm";
import { IconButton } from "ui/icon-button";
import { AiFillBug } from "solid-icons/ai";

export const Feedback = (props: {
  children?: JSXElement;
  exercise?: Exercise;
  position?: "top" | "bottom" | "left" | "right";
}) => {
  const [open, setOpen] = createSignal(false);

  return (
    <Sheet open={open()} onOpenChange={setOpen} modal={false}>
      <SheetTrigger as="div" class="flex justify-end">
        <IconButton variant="ghost">
          <AiFillBug class="text-warning" title="Found error?" />
        </IconButton>
      </SheetTrigger>

      <SheetContent position={props.position ?? "right"}>
        <SheetHeader>
          <SheetTitle>Thanks for getting in touch!</SheetTitle>
        </SheetHeader>
        <FeedbackForm exercise={props.exercise} onSave={() => setOpen(false)} />
      </SheetContent>
    </Sheet>
  );
};
