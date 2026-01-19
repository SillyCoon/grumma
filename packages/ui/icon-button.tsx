import type { JSX, ValidComponent } from "solid-js";
import { splitProps } from "solid-js";

import * as ButtonPrimitive from "@kobalte/core/button";
import type { PolymorphicProps } from "@kobalte/core/polymorphic";
import type { VariantProps } from "class-variance-authority";
import { cva } from "class-variance-authority";

import { cn } from "ui/utils";

const niceIconButtonVariants = cva(
  "inline-flex shrink-0 items-center justify-center whitespace-nowrap bg-transparent ring-offset-background transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 cursor-pointer active:scale-[0.98] [&>svg]:pointer-events-none [&>svg]:shrink-0 [&>svg]:fill-current",
  {
    variants: {
      variant: {
        primary: "text-primary hover:bg-accent active:bg-accent/80",
        secondary: "text-secondary hover:bg-accent active:bg-accent/80",
        outline:
          "border border-input text-foreground hover:bg-accent active:bg-accent/80",
        ghost: "text-foreground hover:bg-accent active:bg-accent/80",
        destructive:
          "text-destructive hover:bg-destructive/10 active:bg-destructive/15",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        sm: "size-8 [&>svg]:size-4",
        md: "size-10 [&>svg]:size-5",
        lg: "size-12 [&>svg]:size-6",
      },
      shape: {
        square: "rounded-md",
        round: "rounded-full",
      },
    },
    defaultVariants: {
      variant: "ghost",
      size: "md",
      shape: "square",
    },
  },
);

type NiceIconButtonProps<T extends ValidComponent = "button"> =
  ButtonPrimitive.ButtonRootProps<T> &
    VariantProps<typeof niceIconButtonVariants> & {
      class?: string;
      children?: JSX.Element;
      href?: string;
    };

const NiceIconButton = <T extends ValidComponent = "button">(
  props: PolymorphicProps<T, NiceIconButtonProps<T>>,
) => {
  const [local, others] = splitProps(props as NiceIconButtonProps, [
    "variant",
    "size",
    "shape",
    "class",
    "href",
  ]);

  const resolvedAs = () =>
    (props as { as?: ValidComponent }).as ?? (local.href ? "a" : undefined);

  return (
    <ButtonPrimitive.Root
      {...others}
      as={resolvedAs()}
      href={local.href}
      class={cn(
        niceIconButtonVariants({
          variant: local.variant,
          size: local.size,
          shape: local.shape,
        }),
        local.class,
      )}
    />
  );
};

export { NiceIconButton, niceIconButtonVariants };
export type { NiceIconButtonProps };
