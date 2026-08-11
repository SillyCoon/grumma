import { NavigationButton } from "ui/navigation-button";
import { setSidebarOpen } from "./Sidebar/store";

export const NavButton = (props: {
  link: string;
  disabled?: boolean;
  text: string;
  badgeContent?: string | number;
  target?: "_blank";
  onClick?: () => void;
}) => {
  return (
    <NavigationButton
      {...props}
      onKeyUp={(e) => e.key === "Enter" && setSidebarOpen(false)}
    />
  );
};
