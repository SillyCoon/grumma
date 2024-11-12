export interface Props {
  text: string;
  link: string;
  class?: string;
}

export const Link = (props: Props) => (
  <a class={props.class} href={props.link}>
    {props.text}
  </a>
);
