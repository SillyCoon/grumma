import type { JSX, ValidComponent } from "solid-js";
import { splitProps } from "solid-js";

import type { PolymorphicProps } from "@kobalte/core";
import * as NavigationMenuPrimitive from "@kobalte/core/navigation-menu";

import { cn } from "packages/ui/utils";
import { NavButtonClass } from "./navigation-button";

const NavigationMenuItem = NavigationMenuPrimitive.Menu;

type NavigationMenuProps<T extends ValidComponent = "ul"> =
  NavigationMenuPrimitive.NavigationMenuRootProps<T> & {
    class?: string | undefined;
    children?: JSX.Element;
  };

const NavigationMenu = <T extends ValidComponent = "ul">(
  props: PolymorphicProps<T, NavigationMenuProps<T>>,
) => {
  const [local, others] = splitProps(props as NavigationMenuProps, [
    "class",
    "children",
  ]);
  return (
    <NavigationMenuPrimitive.Root
      gutter={6}
      class={cn(
        "group/menu flex w-max flex-1 list-none items-center justify-center text-foregrounds-primary data-[orientation=vertical]:flex-col [&>li]:w-full",
        local.class,
      )}
      {...others}
    >
      {local.children}
      <NavigationMenuViewport />
    </NavigationMenuPrimitive.Root>
  );
};

type NavigationMenuTriggerProps<T extends ValidComponent = "button"> =
  NavigationMenuPrimitive.NavigationMenuTriggerProps<T> & {
    class?: string | undefined;
  };

const NavigationMenuTrigger = <T extends ValidComponent = "button">(
  props: PolymorphicProps<T, NavigationMenuTriggerProps<T>>,
) => {
  const [local, others] = splitProps(props as NavigationMenuTriggerProps, [
    "class",
  ]);
  return (
    <NavigationMenuPrimitive.Trigger
      class={cn(
        "group/trigger focus:outline-none",
        NavButtonClass,
        local.class,
      )}
      {...others}
    />
  );
};
const NavigationMenuIcon = () => {
  return (
    <NavigationMenuPrimitive.Icon aria-hidden="true">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        class="group-data-[orientation=vertical]/menu:-rotate-90 relative top-px ml-1 size-3 transition duration-200 group-data-[orientation=vertical]/menu:group-data-[expanded]/trigger:rotate-90 group-data-[expanded]/trigger:rotate-180"
      >
        <title>Expand</title>
        <path d="M6 9l6 6l6 -6" />
      </svg>
    </NavigationMenuPrimitive.Icon>
  );
};

type NavigationMenuViewportProps<T extends ValidComponent = "li"> =
  NavigationMenuPrimitive.NavigationMenuViewportProps<T> & {
    class?: string | undefined;
  };

const NavigationMenuViewport = <T extends ValidComponent = "li">(
  props: PolymorphicProps<T, NavigationMenuViewportProps<T>>,
) => {
  const [local, others] = splitProps(props as NavigationMenuViewportProps, [
    "class",
  ]);
  return (
    <NavigationMenuPrimitive.Viewport
      class={cn(
        // base settings
        "pointer-events-none z-[1000] flex h-[var(--kb-navigation-menu-viewport-height)] w-[var(--kb-navigation-menu-viewport-width)] origin-[var(--kb-menu-content-transform-origin)] items-center justify-center overflow-x-clip overflow-y-visible rounded-md bg-primary opacity-0 shadow-lg data-[expanded]:pointer-events-auto data-[orientation=vertical]:overflow-y-clip data-[orientation=vertical]:overflow-x-visible data-[expanded]:rounded-md",
        // animate
        "animate-content-hide transition-[width,height] duration-200 ease-in data-[expanded]:animate-content-show data-[expanded]:opacity-100 data-[expanded]:ease-out",
        local.class,
      )}
      {...others}
    />
  );
};

type NavigationMenuContentProps<T extends ValidComponent = "ul"> =
  NavigationMenuPrimitive.NavigationMenuContentProps<T> & {
    class?: string | undefined;
  };

const NavigationMenuContent = <T extends ValidComponent = "ul">(
  props: PolymorphicProps<T, NavigationMenuContentProps<T>>,
) => {
  const [local, others] = splitProps(props as NavigationMenuContentProps, [
    "class",
  ]);
  return (
    <NavigationMenuPrimitive.Portal>
      <NavigationMenuPrimitive.Content
        class={cn(
          // base settings
          "pointer-events-none absolute top-0 left-0 box-border p-4 focus:outline-none data-[expanded]:pointer-events-auto",
          // base animation settings
          "data-[motion^=from-]:fade-in data-[motion^=to-]:fade-out data-[motion^=from-]:animate-in data-[motion^=to-]:animate-out",
          // left to right
          "data-[orientation=horizontal]:data-[motion=from-start]:slide-in-from-left-52 data-[orientation=horizontal]:data-[motion=to-end]:slide-out-to-right-52",
          // right to left
          "data-[orientation=horizontal]:data-[motion=from-end]:slide-in-from-right-52 data-[orientation=horizontal]:data-[motion=to-start]:slide-out-to-left-52",
          // top to bottom
          "data-[orientation=vertical]:data-[motion=from-start]:slide-in-from-top-52 data-[orientation=vertical]:data-[motion=to-end]:slide-out-to-bottom-52",
          //bottom to top
          "data-[orientation=vertical]:data-[motion=from-end]:slide-in-from-bottom-52 data-[orientation=vertical]:data-[motion=to-start]:slide-out-to-bottom-52",
          local.class,
        )}
        {...others}
      />
    </NavigationMenuPrimitive.Portal>
  );
};

type NavigationMenuLinkProps<T extends ValidComponent = "a"> =
  NavigationMenuPrimitive.NavigationMenuItemProps<T> & {
    class?: string | undefined;
  };

const NavigationMenuLink = <T extends ValidComponent = "a">(
  props: PolymorphicProps<T, NavigationMenuLinkProps<T>>,
) => {
  const [local, others] = splitProps(props as NavigationMenuLinkProps, [
    "class",
  ]);
  return (
    <NavigationMenuPrimitive.Item
      class={cn(
        "block select-none space-y-1 text-nowrap rounded-md p-3 leading-none no-underline outline-none transition-colors",
        NavButtonClass,
        local.class,
      )}
      {...others}
    />
  );
};

type NavigationMenuLabelProps<T extends ValidComponent = "div"> =
  NavigationMenuPrimitive.NavigationMenuItemLabelProps<T> & {
    class?: string | undefined;
  };

const NavigationMenuLabel = <T extends ValidComponent = "div">(
  props: PolymorphicProps<T, NavigationMenuLabelProps<T>>,
) => {
  const [local, others] = splitProps(props as NavigationMenuLabelProps, [
    "class",
  ]);
  return (
    <NavigationMenuPrimitive.ItemLabel
      class={cn("font-medium text-lg leading-none", local.class)}
      {...others}
    />
  );
};

type NavigationMenuDescriptionProps<T extends ValidComponent = "div"> =
  NavigationMenuPrimitive.NavigationMenuItemDescriptionProps<T> & {
    class?: string | undefined;
  };

const NavigationMenuDescription = <T extends ValidComponent = "div">(
  props: PolymorphicProps<T, NavigationMenuDescriptionProps<T>>,
) => {
  const [local, others] = splitProps(props as NavigationMenuDescriptionProps, [
    "class",
  ]);
  return (
    <NavigationMenuPrimitive.ItemDescription
      class={cn("text-muted-foreground text-sm leading-snug", local.class)}
      {...others}
    />
  );
};

export {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuDescription,
  NavigationMenuIcon,
  NavigationMenuItem,
  NavigationMenuLabel,
  NavigationMenuLink,
  NavigationMenuTrigger,
  NavigationMenuViewport,
};
