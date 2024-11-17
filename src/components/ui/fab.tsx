import { children, type JSX } from "solid-js";

export const FabButton = (props: {
  onClick?: () => void;
  href?: string;
  children: JSX.Element;
}) => {
  const c = children(() => props.children);
  return (
    <ActionComponent href={props.href} onClick={props.onClick}>
      <div class="h-[24px] w-[24px]">{c()}</div>
    </ActionComponent>
  );
};

const ActionComponent = (props: {
  children: JSX.Element;
  href?: string;
  onClick?: () => void;
}) => {
  const c = children(() => props.children);

  const className =
    "fixed right-[16px] bottom-[16px] z-50 flex h-[56px] w-[56px] items-center justify-center rounded-[16px] bg-primary fill-white shadow-md hover:opacity-80 hover:shadow-lg active:opacity-90 active:shadow-md";

  if (props.href)
    return (
      <a class={className} href={props.href}>
        {c()}
      </a>
    );

  return (
    <button class={className} type="button" onClick={props.onClick}>
      {c()}
    </button>
  );
};
