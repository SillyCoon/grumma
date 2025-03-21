import { Badge } from "ui/badge";

export const NavigationButton = (props: {
  link: string;
  disabled?: boolean;
  text: string;
  badgeContent?: string | number;
  onClick?: () => void;
  onKeyUp?: (e: KeyboardEvent) => void;
}) => {
  return (
    <a href={props.link} onKeyUp={props.onKeyUp}>
      <button
        tabIndex={-1}
        onClick={props.onClick}
        disabled={props.disabled}
        class={NavButtonClass}
        type="button"
      >
        <span>{props.text}</span>
        {props.badgeContent && (
          <Badge variant="success" round>
            {props.badgeContent}
          </Badge>
        )}
      </button>
    </a>
  );
};

export const NavButtonClass =
  "inline-flex w-full disabled:pointer-events-none cursor-pointer gap-1 px-2 py-2 font-bold text-foregrounds-primary text-xl disabled:cursor-help disabled:opacity-50 lg:items-center lg:text-primary-foreground lg:hover:bg-secondary/20 lg:hover:shadow-md active:shadow-sm active:bg-secondary/10";
