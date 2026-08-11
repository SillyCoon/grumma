import { actions } from "astro:actions";
import { navigate } from "astro:transitions/client";
import { NavButtonClass } from "ui/navigation-button";
import { NavButton } from "./NavButton";
import { IoLogOut } from "solid-icons/io";

export const LoginButton = (props: { onClick?: () => void }) => {
  return <NavButton text="Login" link="/login" onClick={props.onClick} />;
};

export const LogoutButton = (props: { onClick?: () => void }) => {
  return (
    <form
      class="flex"
      method="post"
      onSubmit={async (e) => {
        e.preventDefault();
        await actions.logout(new FormData());
        navigate("/");
      }}
    >
      <button
        onClick={props.onClick}
        type="submit"
        class={NavButtonClass}
        aria-label="Logout"
        title="Logout"
      >
        <IoLogOut size={20} aria-hidden="true" />
      </button>
    </form>
  );
};
