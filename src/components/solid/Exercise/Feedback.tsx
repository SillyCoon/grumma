import type { Exercise } from "grammar-sdk";
import type { JSXElement } from "solid-js";
import { createSignal } from "solid-js";
import { Button } from "ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "ui/sheet";
import { FeedbackForm } from "./FeedbackForm";

export const Feedback = (props: {
  children?: JSXElement;
  exercise?: Exercise;
  position?: "top" | "bottom" | "left" | "right";
}) => {
  const [open, setOpen] = createSignal(false);

  // TODO: refactor
  // add sonner
  // const save = async (data: FormData) => {
  //   const isAboutGrammarPoint = data.get("isAboutGrammarPoint") === "on";
  //   try {
  //     const request = {
  //       message: data.get("message") as string,
  //       email: data.get("email")?.length
  //         ? (data.get("email") as string)
  //         : undefined,
  //       grammar:
  //         isAboutGrammarPoint && props.exercise
  //           ? {
  //               grammarPointId: +props.exercise.grammarPointId,
  //               exerciseOrder: props.exercise.order,
  //             }
  //           : undefined,
  //     };
  //     setOpen(false);
  //     await actions.saveFeedback(request);
  //   } catch (e) {
  //     console.error(e);
  //   }
  // };

  return (
    <Sheet open={open()} onOpenChange={setOpen} modal={false}>
      <SheetTrigger>
        {props.children ?? <Button variant="ghost">Found error?</Button>}
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
