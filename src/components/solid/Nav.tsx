import { actions } from "astro:actions";
import { NavButton } from "./NavButton";

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
        action={props.loggedIn ? actions.logout : actions.loginWithGoogle}
      >
        <button
          onClick={props.onClick}
          value="google"
          name="provider"
          type="submit"
          class="inline-flex w-full gap-1 px-4 py-2 font-bold text-foregrounds-primary text-xl disabled:cursor-help disabled:opacity-50 lg:items-center lg:text-primary-foreground lg:hover:bg-secondary/20 lg:hover:shadow-md"
        >
          {props.loggedIn ? "Logout" : "Login"}
        </button>
      </form>
    </>
  );
};
