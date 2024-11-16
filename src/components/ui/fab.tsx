import { children, type JSX } from "solid-js";

export const FabButton = (props: {
  onClick: () => void;
  children: JSX.Element;
}) => {
  const c = children(() => props.children);
  return (
    <button
      class="fixed right-[16px] bottom-[16px] z-50 flex h-[56px] w-[56px] items-center justify-center rounded-[16px] bg-primary fill-white shadow-md hover:opacity-80 hover:shadow-lg active:opacity-90 active:shadow-md"
      type="button"
      onClick={props.onClick}
    >
      <div class="h-[24px] w-[24px]">{c()}</div>
    </button>
  );
};
