type Props = {
  title: string;
  className: string;
};

export const Title = (props: Props) => {
  const split = () => props.title.split("/");

  return (
    <section class={`grid gap-2 ${props.className}`}>
      <h1 class="text-center font-bold text-3xl text-primary">
        {split()[0]?.trim()}
      </h1>
      <h1 class="text-center font-bold text-3xl text-secondary">
        {split()[1]?.trim()}
      </h1>
    </section>
  );
};
