export const Answer = (props: { answer?: string }) => (
  <span class="text-secondary"> {props.answer || "___"} </span>
);
