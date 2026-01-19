import { IconButton } from "ui/dumb-icon-button";
import { ArrowForward } from "ui/icons";

export const ForwardButton = (props: { href: string; class?: string }) => (
  <IconButton href={props.href} class={props.class}>
    <ArrowForward />
  </IconButton>
);
