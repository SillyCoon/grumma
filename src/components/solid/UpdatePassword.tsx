import { actions } from "astro:actions";
import { Show } from "solid-js";
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

export const UpdatePasswordForm = (props: {
  success?: boolean;
  errorMessage?: string;
  code: string;
}) => {
  return (
    <Card variant="outlined">
      <CardHeader>
        <CardTitle>Update password</CardTitle>
        <CardDescription>Enter a new password.</CardDescription>
      </CardHeader>

      <CardContent class="space-y-2">
        <form
          id="password"
          method="post"
          action={actions.updatePassword}
          class="grid gap-4"
        >
          <input type="hidden" name="code" value={props.code} />
          <TextField class="space-y-1">
            <TextFieldLabel>New Password</TextFieldLabel>
            <TextFieldInput name="password" type="password" />
          </TextField>
          <Show when={props.errorMessage}>
            <Alert variant="destructive">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{props.errorMessage}</AlertDescription>
            </Alert>
          </Show>
          <Button type="submit" form="password">
            Update Password
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
