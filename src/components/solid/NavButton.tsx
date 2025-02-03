import { Badge } from "ui/badge";
import { setSidebarOpen } from "./Sidebar/store";

export const NavButton = (props: {
  link: string;
  disabled?: boolean;
  text: string;
  badgeContent?: string | number;
  onClick?: () => void;
}) => {
  return (
    <a
      href={props.link}
      onKeyUp={(e) => e.key === "Enter" && setSidebarOpen(false)}
    >
      <button
        tabIndex={-1}
        onClick={props.onClick}
        disabled={props.disabled}
        class="inline-flex w-full gap-1 px-2 py-2 font-bold text-foregrounds-primary text-xl disabled:cursor-help disabled:opacity-50 lg:items-center lg:text-primary-foreground lg:hover:bg-secondary/20 lg:hover:shadow-md"
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
