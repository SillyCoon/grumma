import { actions } from "astro:actions";
import { navigate } from "astro:transitions/client";
import { Match, Switch } from "solid-js";
import { NavButtonClass } from "ui/navigation-button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuIcon,
  NavigationMenuItem,
  NavigationMenuLabel,
  NavigationMenuLink,
  NavigationMenuTrigger,
} from "ui/navigation-menu";
import { NavButton } from "./NavButton";

export const Nav = (props: {
  loggedIn?: boolean;
  reviewCount?: number | null;
  onClick?: () => void;
}) => {
  const reviewCount = props.reviewCount || undefined;
  return (
    <>
      <NavButton
        disabled={!props.loggedIn}
        text="Dashboard"
        link="/dashboard"
        onClick={props.onClick}
      />
      <NavButton
        disabled={!props.loggedIn}
        text="Learn"
        onClick={props.onClick}
        link="/sr/lesson"
      />
      <NavButton
        disabled={!props.loggedIn}
        text="Review"
        link="/sr/review"
        badgeContent={reviewCount}
        onClick={props.onClick}
      />
      <NavButton text="Grammar" link="/grammar/" onClick={props.onClick} />
      <NavButton
        text="Cram"
        link="/grammar?mode=cram"
        onClick={props.onClick}
      />
      <Switch>
        <Match when={props.loggedIn}>
          <NavigationMenu>
            <NavigationMenuItem>
              <NavigationMenuTrigger>
                Help
                <NavigationMenuIcon />
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <NavigationMenuLink href="/help">
                  <NavigationMenuLabel>How to use</NavigationMenuLabel>
                </NavigationMenuLink>
                <NavigationMenuLink href="/contact-us">
                  <NavigationMenuLabel>Contact us</NavigationMenuLabel>
                </NavigationMenuLink>
              </NavigationMenuContent>
            </NavigationMenuItem>
          </NavigationMenu>
        </Match>
        <Match when={!props.loggedIn}>
          <NavButton text="Help" link="/help" onClick={props.onClick} />
        </Match>
      </Switch>

      {props.loggedIn ? (
        <LogoutButton onClick={props.onClick} />
      ) : (
        <LoginButton onClick={props.onClick} />
      )}
    </>
  );
};

const LoginButton = (props: { onClick?: () => void }) => {
  return <NavButton text="Login" link="/login" onClick={props.onClick} />;
};

const LogoutButton = (props: { onClick?: () => void }) => {
  return (
    <form
      method="post"
      onSubmit={async (e) => {
        e.preventDefault();
        await actions.logout(new FormData());
        navigate("/");
      }}
    >
      <button onClick={props.onClick} type="submit" class={NavButtonClass}>
        Logout
      </button>
    </form>
  );
};
