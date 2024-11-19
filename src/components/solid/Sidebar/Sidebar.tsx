import { createEffect, Show } from "solid-js";
import { Nav } from "../Nav";
import { setSidebarOpen, sidebarOpen } from "./store";

export const Sidebar = (props: { loggedIn?: boolean }) => {
  const close = () => {
    setSidebarOpen((v) => !v);
  };

  createEffect(() => {
    if (sidebarOpen()) {
      document.body.style.overflow = "hidden";
      document.onkeyup = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
          close();
        }
      };
    } else {
      document.body.style.overflow = "auto";
    }
  });

  return (
    <>
      <div
        class={`fixed top-[72px] left-0 z-50 flex h-full w-64 flex-col border-r bg-white shadow-md transition-all ${sidebarOpen() ? "translate-x-0" : "-translate-x-64"} lg:hidden`}
      >
        <div class="flex-grow overflow-y-auto overflow-x-hidden">
          <ul class="flex flex-col space-y-1 py-4">
            <Nav onClick={close} loggedIn={props.loggedIn} />
          </ul>
        </div>
      </div>
      <Show when={sidebarOpen()}>
        {/* biome-ignore lint/a11y/useKeyWithClickEvents: <To global event handler> */}
        <div
          class="fixed top-0 left-0 z-10 h-screen w-screen backdrop-invert backdrop-opacity-25"
          onClick={close}
        />
      </Show>
    </>
  );
};
