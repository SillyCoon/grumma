export const Play = ({ title }: { title: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960">
    <title>{title ?? "Play"}</title>
    <path d="M320-200v-560l440 280-440 280Zm80-280Zm0 134 210-134-210-134v268Z" />
  </svg>
);
