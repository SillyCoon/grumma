import type { ParentComponent } from "solid-js";
import { IconButton } from "./IconButton";
import { Send } from "@components/icons/Send";

export const SendButton: ParentComponent<{
  class?: string;
  onClick: () => void;
}> = (props) => {
  return (
    <IconButton class={props.class} onClick={props.onClick} variant="secondary">
      <Send />
    </IconButton>
  );
};
