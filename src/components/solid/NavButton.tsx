import { NavigationButton } from "packages/ui/navigation-button";
import { setSidebarOpen } from "./Sidebar/store";

export const NavButton = (props: {
  link: string;
  disabled?: boolean;
  text: string;
  badgeContent?: string | number;
  onClick?: () => void;
}) => {
  return (
    <NavigationButton
      {...props}
      onKeyUp={(e) => e.key === "Enter" && setSidebarOpen(false)}
    />
  );
};
