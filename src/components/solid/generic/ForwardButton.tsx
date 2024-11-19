import { ArrowForward } from "@components/icons/ArrowForward";
import { IconButton } from "@components/ui/icon-button";

export const ForwardButton = (props: { href: string }) => (
  <a href={props.href}>
    <IconButton>
      <ArrowForward />
    </IconButton>
  </a>
);
