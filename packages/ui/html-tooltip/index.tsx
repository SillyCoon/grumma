import type { JSX } from "solid-js";
import styles from "./index.module.css";

export const TooltipTrigger = (props: { children: JSX.Element }) => {
  return <div class={styles.anchorButton}>{props.children}</div>;
};

export const TooltipContent = (props: { children: JSX.Element }) => {
  return (
    <div class={styles.tooltip}>
      <p>{props.children}</p>
    </div>
  );
};
