import { actions } from "astro:actions";
import { NavButton, NavButtonClass } from "./NavButton";
import { navigate } from "astro:transitions/client";

export const Nav = (props: {
  loggedIn?: boolean;
  reviewCount?: number | null;
  onClick?: () => void;
}) => {
  const reviewCount = props.reviewCount || undefined;
  return (
    <>
      <NavButton
        disabled={!props.loggedIn}
        text="Dashboard"
        link="/dashboard"
        onClick={props.onClick}
      />
      <NavButton
        disabled={!props.loggedIn}
        text="Learn"
        onClick={props.onClick}
        link="/sr/lesson"
      />
      <NavButton
        disabled={!props.loggedIn}
        text="Review"
        link="/sr/review"
        badgeContent={reviewCount}
        onClick={props.onClick}
      />
      <NavButton text="Grammar" link="/grammar/" onClick={props.onClick} />
      <NavButton
        text="Cram"
        link="/grammar?mode=cram"
        onClick={props.onClick}
      />
      <NavButton text="Help" link="/help" onClick={props.onClick} />
      <form
        method="post"
        action={!props.loggedIn ? actions.loginWithGoogle : ""}
        onSubmit={async (e) => {
          if (props.loggedIn) {
            e.preventDefault();
            await actions.logout(new FormData());
            navigate("/");
          }
        }}
      >
        <button
          onClick={props.onClick}
          value="google"
          name="provider"
          type="submit"
          class={NavButtonClass}
        >
          {props.loggedIn ? "Logout" : "Login"}
        </button>
      </form>
    </>
  );
};
