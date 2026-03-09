import type { Session, User } from "@supabase/supabase-js";
import { actions, type SafeResult } from "astro:actions";
import { Popover, PopoverContent, PopoverTrigger } from "packages/ui/popover";
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

export const LoginForm = (props: { result: Result; errorMessage?: string }) => {
  return (
    <Tabs defaultValue="account" class="max-w-[500px]">
      <TabsList class="grid w-full grid-cols-2">
        <TabsTrigger value="account">Login</TabsTrigger>
        <TabsTrigger value="password">Create account</TabsTrigger>
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
        <CardTitle>
          {props.type === "signin" ? "Login" : "Create account"}
        </CardTitle>
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
            {props.type === "signin" ? "Login" : "Create account"}
          </Button>
          {props.type === "signin" && (
            <a href="/login/forgot" class="contents">
              <Button variant="ghost">Forgot password?</Button>
            </a>
          )}
        </form>
      </CardContent>

      <CardFooter class="flex flex-col items-center gap-2">
        <p>or</p>
        <form
          id="google"
          class="text-4xl"
          action={actions.loginWithGoogle}
          method="post"
        >
          <SignInWithGoogle
            type="submit"
            value="google"
            name="provider"
            form="google"
          />
        </form>
        <Popover>
          <PopoverTrigger>
            <span class="cursor-pointer text-primary text-sm underline">
              Why the website link is not grumma.org?
            </span>
          </PopoverTrigger>
          <PopoverContent>
            <div class="flex max-w-100 flex-col gap-0.5">
              <p>
                If you decide to sign in with Google, the website link on the
                next step will be different. As a free project, we use a free
                login system and cannot choose the link.
              </p>
              <p>
                We will not see any of your Google account information except
                your email address and name. However, if you are still worried,
                please use the regular login form instead.
              </p>
            </div>
          </PopoverContent>
        </Popover>
      </CardFooter>
    </Card>
  );
};
