type Props = {
  shortTitle: string;
  detailedTitle: string;
  englishTitle: string;
  className: string;
};

export const Title = (props: Props) => {
  return (
    <section class={`grid gap-2 ${props.className}`}>
      <h1 class="text-center font-bold text-3xl text-primary">
        {props.shortTitle}
      </h1>
      <h1 class="text-center font-bold text-3xl text-secondary">
        {props.detailedTitle}
      </h1>
      <h1 class="text-center font-bold text-2xl text-secondary">
        {props.englishTitle}
      </h1>
    </section>
  );
};
