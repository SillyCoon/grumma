import { Button } from "@components/ui/button";
import { setSidebarOpen } from "./Sidebar/store";

export const HamburgerButton = () => {
  return (
    <Button class="lg:hidden" onClick={() => setSidebarOpen((prev) => !prev)}>
      <svg
        class="fill-white"
        xmlns="http://www.w3.org/2000/svg"
        height="24px"
        viewBox="0 -960 960 960"
        width="24px"
      >
        <title>Hamburger</title>
        <path d="M120-240v-80h720v80H120Zm0-200v-80h720v80H120Zm0-200v-80h720v80H120Z" />
      </svg>
    </Button>
  );
};
