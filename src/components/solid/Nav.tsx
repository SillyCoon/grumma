import { actions } from "astro:actions";
import { navigate } from "astro:transitions/client";
import { NavButtonClass } from "ui/navigation-button";
import { HelpNav } from "./HelpNav";
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
      <HelpNav onClick={props.onClick} loggedIn={props.loggedIn} />

      {props.loggedIn ? (
        <LogoutButton onClick={props.onClick} />
      ) : (
        <LoginButton onClick={props.onClick} />
      )}
    </>
  );
};

const LoginButton = (props: { onClick?: () => void }) => {
  return <NavButton text="Login" link="/login" onClick={props.onClick} />;
};

const LogoutButton = (props: { onClick?: () => void }) => {
  return (
    <form
      method="post"
      onSubmit={async (e) => {
        e.preventDefault();
        await actions.logout(new FormData());
        navigate("/");
      }}
    >
      <button onClick={props.onClick} type="submit" class={NavButtonClass}>
        Logout
      </button>
    </form>
  );
};
