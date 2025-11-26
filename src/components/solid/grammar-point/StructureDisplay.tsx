interface StructureDisplayProps {
  structure?: string;
}

export const StructureDisplay = (props: StructureDisplayProps) => {
  return (
    <section
      class="prose whitespace-pre-line [&_b]:text-secondary"
      innerHTML={props.structure?.length ? props.structure : "Coming soon!"}
    />
  );
};
