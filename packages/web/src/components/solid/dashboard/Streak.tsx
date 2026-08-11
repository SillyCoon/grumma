import { actions } from "astro:actions";
import { createResource, Suspense } from "solid-js";

export const Streak = () => {
  const [streak] = createResource(() =>
    actions.streak({
      today: new Date(),
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    }),
  );

  return <Suspense fallback={0}>{streak()?.data}</Suspense>;
};
