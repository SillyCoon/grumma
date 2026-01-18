import { children, splitProps, type JSX } from "solid-js";

export const SelectContainer = (
  props: JSX.SelectHTMLAttributes<HTMLDivElement>,
) => {
  return <div {...props} />;
};

export const Select = (
  props: {
    children: JSX.Element[];
  } & JSX.SelectHTMLAttributes<HTMLSelectElement>,
) => {
  const resolved = children(() => props.children);
  const [_local, others] = splitProps(props, ["children"]);
  return (
    <select
      {...others}
      class="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:font-medium file:text-sm placeholder:text-muted-foreground focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50"
    >
      {resolved()}
    </select>
  );
};

export const SelectLabel = (
  props: JSX.LabelHTMLAttributes<HTMLLabelElement>,
) => {
  return (
    // biome-ignore lint/a11y/noLabelWithoutControl: <explanation>
    <label
      {...props}
      class="font-medium text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
    />
  );
};

export const SelectOption = (
  props: JSX.OptionHTMLAttributes<HTMLOptionElement>,
) => {
  return <option {...props} />;
};
