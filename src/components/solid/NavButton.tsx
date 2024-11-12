import { Badge } from "@components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@components/ui/tooltip";

export const NavButton = (props: {
  disabled?: boolean;
  text: string;
  badgeContent?: string | number;
}) => {
  return (
    <Tooltip>
      <TooltipTrigger>
        <button
          onClick={() => console.log("click")}
          disabled={props.disabled}
          class="disabled:cursor-help disabled:opacity-50 gap-1 text-primary-foreground text-xl font-bold px-4 py-2 hover:shadow-md hover:bg-secondary/20"
          type="button"
        >
          <span>{props.text}</span>
          {props.badgeContent && (
            <Badge variant="success" round>
              {props.badgeContent}
            </Badge>
          )}
        </button>
      </TooltipTrigger>
      {props.disabled && (
        <TooltipContent>
          <div>Please login to use space repetition feature</div>
        </TooltipContent>
      )}
    </Tooltip>
  );
};
