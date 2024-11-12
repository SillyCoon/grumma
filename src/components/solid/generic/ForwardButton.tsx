import { IoArrowForwardOutline } from "solid-icons/io";
import { IconButton } from "./IconButton";

export const ForwardButton = (props: { href: string }) => (
  <a href={props.href}>
    <IconButton Icon={IoArrowForwardOutline} />
  </a>
);
