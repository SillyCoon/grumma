import type { Session, User } from "@supabase/supabase-js";
import { actions, type SafeResult } from "astro:actions";
import { BsEye, BsEyeSlash } from "solid-icons/bs";
import { createSignal, Show } from "solid-js";
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
import { IconButton } from "ui/icon-button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "ui/tabs";
import { TextField, TextFieldInput, TextFieldLabel } from "ui/text-field";
import { autofocus } from "@solid-primitives/autofocus";

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
  const [showPassword, setShowPassword] = createSignal(false);

  const passwordId = () =>
    props.type === "signin" ? "current-password" : "new-password";

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
            <TextFieldLabel for="email">Email</TextFieldLabel>
            <TextFieldInput
              autofocus
              ref={autofocus}
              id="email"
              name="email"
              type="email"
              autocomplete="username"
              required
            />
          </TextField>
          <TextField class="relative space-y-1">
            <TextFieldLabel
              for={
                props.type === "signin" ? "current-password" : "new-password"
              }
            >
              Password
            </TextFieldLabel>
            <div class="relative">
              <TextFieldInput
                id={passwordId()}
                name="password"
                type={showPassword() ? "text" : "password"}
                autocomplete={passwordId()}
                required
              />
              <IconButton
                type="button"
                class="absolute top-0 right-0"
                onClick={() => setShowPassword(!showPassword())}
              >
                {showPassword() ? (
                  <BsEyeSlash aria-label="Hide password" />
                ) : (
                  <BsEye aria-label="Show password" />
                )}
              </IconButton>
            </div>
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
      </CardFooter>
    </Card>
  );
};
