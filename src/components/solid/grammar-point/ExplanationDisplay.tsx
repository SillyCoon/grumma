interface ExplanationDisplayProps {
  text?: string;
}

export const ExplanationDisplay = (props: ExplanationDisplayProps) => {
  return (
    <section
      class="prose prose-slate max-w-none [&_b]:text-secondary [&_strong]:text-secondary"
      innerHTML={props.text?.length ? props.text : "Coming soon!"}
    />
  );
};
