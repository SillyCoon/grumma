import { Match, Switch } from "solid-js";
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

type Props = {
  onClick?: () => void;
  loggedIn?: boolean;
};

export const HelpNav = (props: Props) => {
  return (
    <Switch>
      <Match when={props.loggedIn}>
        <HelpMenu {...props} />
        <HelpFlat {...props} />
      </Match>
      <Match when={!props.loggedIn}>
        <NavButton text="How to use" link="/help" onClick={props.onClick} />
      </Match>
    </Switch>
  );
};

const HelpMenu = (props: Props) => {
  return (
    <NavigationMenu class="hidden lg:block">
      <NavigationMenuItem>
        <NavigationMenuTrigger>
          Help
          <NavigationMenuIcon />
        </NavigationMenuTrigger>
        <NavigationMenuContent>
          <NavigationMenuLink href="/help" onClick={props.onClick}>
            <NavigationMenuLabel>How to use</NavigationMenuLabel>
          </NavigationMenuLink>
          <NavigationMenuLink href="/contact-us" onClick={props.onClick}>
            <NavigationMenuLabel>Contact us</NavigationMenuLabel>
          </NavigationMenuLink>
        </NavigationMenuContent>
      </NavigationMenuItem>
    </NavigationMenu>
  );
};

const HelpFlat = (props: Props) => {
  return (
    <div class="lg:hidden">
      <NavButton text="How to use" link="/help" onClick={props.onClick} />
      <NavButton text="Contact us" link="/contact-us" onClick={props.onClick} />
    </div>
  );
};
