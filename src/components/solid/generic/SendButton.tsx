import { Send } from "ui/icons";
import type { ParentComponent } from "solid-js";
import { IconButton } from "ui/icon-button";

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
