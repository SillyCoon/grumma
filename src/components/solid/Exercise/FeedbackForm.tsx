import { actions } from "astro:actions";
import { navigate } from "astro:transitions/client";
import type { Exercise } from "grammar-sdk";
import toast from "solid-toast";
import { Button } from "ui/button";
import { Checkbox } from "ui/checkbox";
import { Label } from "ui/label";
import { SheetFooter } from "ui/sheet";
import {
  TextField,
  TextFieldInput,
  TextFieldLabel,
  TextFieldTextArea,
} from "ui/text-field";

export const FeedbackForm = (props: {
  exercise?: Exercise;
  onSave?: () => void;
  navigateOnSave?: string;
}) => {
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
        grammar:
          isAboutGrammarPoint && props.exercise
            ? {
                grammarPointId: +props.exercise.grammarPointId,
                exerciseOrder: props.exercise.order,
              }
            : undefined,
      };
      await actions.saveFeedback(request);
      toast.success("Feedback sent!");
      props.onSave?.();
      props.navigateOnSave && navigate(props.navigateOnSave);
    } catch (e) {
      console.error(e);
    }
  };

  return (
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
          <TextFieldLabel>Please describe the issue you found:</TextFieldLabel>
          <TextFieldTextArea required name="message" />
        </TextField>
        <TextField>
          <TextFieldLabel>Contact email (optional):</TextFieldLabel>
          <TextFieldInput name="email" type="email" />
        </TextField>
        {props.exercise && (
          <div class="flex items-center gap-2">
            <Checkbox
              id="isAboutGrammarPoint"
              name="isAboutGrammarPoint"
              defaultChecked
            />
            <Label for="isAboutGrammarPoint">About this grammar point?</Label>
          </div>
        )}
      </div>
      <SheetFooter>
        <Button type="submit" form="feedback">
          Send
        </Button>
      </SheetFooter>
    </form>
  );
};
