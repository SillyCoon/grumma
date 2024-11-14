import { createEffect } from "solid-js";

export const Button = (props: {
  onClick: () => void;
  class?: string;
  text: string;
  disabled: boolean;
}) => {
  createEffect(() => {
    console.log(props.disabled);
  });

  return (
    <button
      type="button"
      class={`rounded-full border border-secondary bg-white px-4 py-2 font-semibold text-secondary transition duration-300 hover:border-secondary/50 hover:bg-secondary hover:text-white focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 ${props.class}`}
      onClick={props.onClick}
      disabled={props.disabled}
    >
      {props.text}
    </button>
  );
};
