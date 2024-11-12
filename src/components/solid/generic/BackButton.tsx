import { IoArrowBackOutline } from "solid-icons/io";

export const BackButton = ({
  to,
  className,
}: {
  to: string;
  className: string;
}) => {
  return (
    <a href={to} class={className}>
      <IoArrowBackOutline
        size={40}
        class="text-primary hover:text-blue-800 cursor-pointer"
      />
    </a>
  );
};
