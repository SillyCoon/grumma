export const ArrowBack = (props: { title: string }) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960">
      <title>{props.title ?? "Back"}</title>
      <path d="m313-440 224 224-57 56-320-320 320-320 57 56-224 224h487v80H313Z" />
    </svg>
  );
};
