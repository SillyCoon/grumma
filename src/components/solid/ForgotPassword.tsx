import { actions } from "astro:actions";
import { type JSX, Show, children } from "solid-js";
import { Alert, AlertDescription, AlertTitle } from "ui/alert";
import { Button } from "ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "ui/card";
import { TextField, TextFieldInput, TextFieldLabel } from "ui/text-field";

export const ForgotPasswordForm = (props: {
  errorMessage?: string;
  children?: JSX.Element;
}) => {
  const resolved = children(() => props.children);
  return (
    <Card variant="outlined" class="w-lg">
      <CardHeader>
        <CardTitle>Restore password</CardTitle>
        <CardDescription>
          Enter your email and we will send you instructions to reset your
          password.
        </CardDescription>
      </CardHeader>

      <CardContent class="space-y-2">
        <form
          id="password"
          method="post"
          action={actions.resetPassword}
          class="grid gap-4"
        >
          <TextField class="space-y-1">
            <TextFieldLabel>Email</TextFieldLabel>
            <TextFieldInput name="email" type="email" />
          </TextField>
          {resolved()}
          <Show when={props.errorMessage}>
            <Alert variant="destructive">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{props.errorMessage}</AlertDescription>
            </Alert>
          </Show>
          <Button type="submit" form="password">
            Send reset instructions
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
