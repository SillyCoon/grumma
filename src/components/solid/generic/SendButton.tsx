import { Send } from "@components/icons/Send";
import { IconButton } from "@components/ui/icon-button";
import type { ParentComponent } from "solid-js";

export const SendButton: ParentComponent<{
  class?: string;
  type?: "button" | "submit" | "reset";
  onClick?: () => void;
}> = (props) => {
  return (
    <IconButton
      class={props.class}
      onClick={props.onClick}
      type={props.type}
      variant="secondary"
    >
      <Send />
    </IconButton>
  );
};
