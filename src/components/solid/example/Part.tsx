import type { Example } from "grammar-sdk";

type Props = { part: Example };

export const Part = (props: Props) => {
  return (
    <p class="text-center text-xl">
      {props.part[0]}
      <span class=" text-secondary ">{props.part[1]}</span>
      {props.part[2]}
    </p>
  );
};
