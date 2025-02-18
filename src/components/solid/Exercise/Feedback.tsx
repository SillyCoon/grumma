import { actions } from "astro:actions";
import type { Exercise } from "grammar-sdk";
import { createSignal } from "solid-js";
import { Button } from "ui/button";
import { Checkbox } from "ui/checkbox";
import { Label } from "ui/label";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "ui/sheet";
import {
  TextField,
  TextFieldInput,
  TextFieldLabel,
  TextFieldTextArea,
} from "ui/text-field";

export const Feedback = (props: { exercise: Exercise }) => {
  const [open, setOpen] = createSignal(false);

  // TODO: refactor
  // add sonner
  const save = async (data: FormData) => {
    const isAboutGrammarPoint = data.get("isAboutGrammarPoint") === "on";
    try {
      const request = {
        message: data.get("message") as string,
        email: data.get("email")?.length
          ? (data.get("email") as string)
          : undefined,
        grammar: isAboutGrammarPoint
          ? {
              grammarPointId: +props.exercise.grammarPointId,
              exerciseOrder: props.exercise.order,
            }
          : undefined,
      };
      setOpen(false);
      await actions.saveFeedback(request);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <Sheet open={open()} onOpenChange={setOpen} modal={false}>
      <SheetTrigger>
        <Button variant="ghost">Found error?</Button>
      </SheetTrigger>
      <SheetContent position="right">
        <SheetHeader>
          <SheetTitle>Thank you for your feedback! </SheetTitle>
        </SheetHeader>
        <form
          id="feedback"
          name="feedback"
          onSubmit={async (e) => {
            e.preventDefault();
            await save(new FormData(e.currentTarget));
          }}
        >
          <div class="flex flex-col gap-4 py-4">
            <TextField>
              <TextFieldLabel>
                Please describe the issue you found:
              </TextFieldLabel>
              <TextFieldTextArea required name="message" />
            </TextField>
            <TextField>
              <TextFieldLabel>Contact email (optional):</TextFieldLabel>
              <TextFieldInput name="email" type="email" />
            </TextField>
            <div class="flex items-center gap-2">
              <Checkbox
                id="isAboutGrammarPoint"
                name="isAboutGrammarPoint"
                defaultChecked
              />
              <Label for="isAboutGrammarPoint">About this grammar point?</Label>
            </div>
          </div>
          <SheetFooter>
            <Button type="submit" form="feedback">
              Send
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
};
