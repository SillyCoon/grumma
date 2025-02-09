import type { Session, User } from "@supabase/supabase-js";
import { actions, type SafeResult } from "astro:actions";
import { Show } from "solid-js";
import { Alert, AlertDescription, AlertTitle } from "ui/alert";
import { Button } from "ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "ui/card";
import { SignInWithGoogle } from "ui/google-button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "ui/tabs";
import { TextField, TextFieldInput, TextFieldLabel } from "ui/text-field";

type Result =
  | SafeResult<
      {
        email: string;
        password: string;
      },
      {
        user: User | null;
        session: Session | null;
      }
    >
  | undefined;

export const LoginForm = (props: {
  result: Result;
  errorMessage?: string;
}) => {
  return (
    <Tabs defaultValue="account" class="w-[500px]">
      <TabsList class="grid w-full grid-cols-2">
        <TabsTrigger value="account">Sign In</TabsTrigger>
        <TabsTrigger value="password">Sign Up</TabsTrigger>
      </TabsList>
      <TabsContent value="account">
        <Form
          type="signin"
          action={actions.signin}
          result={props.result}
          errorMessage={props.errorMessage}
        />
      </TabsContent>
      <TabsContent value="password">
        <Form
          type="signup"
          action={actions.signup}
          result={props.result}
          errorMessage={props.errorMessage}
        />
      </TabsContent>
    </Tabs>
  );
};

const Form = (props: {
  action: string;
  result: Result;
  type: "signin" | "signup";
  errorMessage?: string;
}) => {
  return (
    <Card variant="outlined">
      <CardHeader>
        <CardTitle>Account</CardTitle>
        <CardDescription>
          If you want to use a space repetition feature, please sign in or
          create an account:
        </CardDescription>
      </CardHeader>

      <CardContent class="space-y-2">
        <form
          id="password"
          method="post"
          action={props.action}
          class="grid gap-4"
        >
          <TextField class="space-y-1">
            <TextFieldLabel>Email</TextFieldLabel>
            <TextFieldInput name="email" type="email" />
          </TextField>
          <TextField class="space-y-1">
            <TextFieldLabel>Password</TextFieldLabel>
            <TextFieldInput name="password" type="password" />
          </TextField>
          <Show when={props.result?.error}>
            <Alert variant="destructive">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{props.errorMessage}</AlertDescription>
            </Alert>
          </Show>
          <Button type="submit" form="password">
            {props.type === "signin" ? "Sign In" : "Sign Up"}
          </Button>
        </form>
      </CardContent>

      <CardFooter class="flex flex-col items-center gap-2">
        <p>or</p>
        <form class="text-4xl" action={actions.loginWithGoogle} method="post">
          <SignInWithGoogle type="submit" value="google" name="provider" />
        </form>
      </CardFooter>
    </Card>
  );
};
