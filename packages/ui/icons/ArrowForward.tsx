export const ArrowForward = (props: { title: string }) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960">
      <title>{props.title ?? "Forward"}</title>
      <path d="M647-440H160v-80h487L423-744l57-56 320 320-320 320-57-56 224-224Z" />
    </svg>
  );
};
