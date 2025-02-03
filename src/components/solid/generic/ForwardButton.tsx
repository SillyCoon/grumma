import { ArrowForward } from "@components/icons/ArrowForward";
import { IconButton } from "ui/icon-button";

export const ForwardButton = (props: { href: string; class?: string }) => (
  <IconButton href={props.href} class={props.class}>
    <ArrowForward />
  </IconButton>
);
