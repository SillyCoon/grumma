import type { ParentComponent } from "solid-js";
import { IconButton } from "./IconButton";
import { Send } from "@components/icons/Send";

export const SendButton: ParentComponent<{
  onClick: () => void;
}> = (props) => {
  return (
    <IconButton onClick={props.onClick} variant="secondary">
      <Send />
    </IconButton>
  );
};
