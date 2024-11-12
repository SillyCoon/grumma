type Props = {
  title: string;
  className: string;
};

export const Title = (props: Props) => {
  const split = () => props.title.split("/");

  return (
    <section class={`grid gap-2 ${props.className}`}>
      <h1 class="text-3xl font-bold text-primary text-center">
        {split()[0]?.trim()}
      </h1>
      <h1 class="text-3xl font-bold text-secondary text-center">
        {split()[1]?.trim()}
      </h1>
    </section>
  );
};
