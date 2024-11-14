import { IoSend } from "solid-icons/io";
import type { ParentComponent } from "solid-js";

export const SendButton: ParentComponent<{
  onClick: () => void;
}> = (props) => {
  return (
    <IoSend
      size={24}
      class="cursor-pointer text-secondary hover:text-secondary-800"
      onClick={props.onClick}
    />
  );
};
