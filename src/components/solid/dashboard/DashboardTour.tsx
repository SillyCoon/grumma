import { actions } from "astro:actions";
import introJs from "intro.js";
import "intro.js/introjs.css";
import { onCleanup, onMount } from "solid-js";

export function DashboardTour(props: { completed: boolean }) {
  let tour: ReturnType<typeof introJs.tour> | null = null;

  onMount(() => {
    if (props.completed) return;

    tour = introJs.tour();

    tour.setOptions({
      showBullets: true,
      exitOnOverlayClick: false,
      scrollTo: "tooltip",
      buttonClass:
        "cursor-pointer h-8 w-20 inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground",
      scrollPadding: 80,
      steps: [
        {
          title: "Welcome to Grumma!",
          intro: "Let me show you around.",
        },
        {
          element: '[data-tour="learn-card"]',
          title: "Learn New Grammar",
          intro:
            'Click here to start learning a new grammar point. When you finish reading push the "arrow" button on the right to check your understanding. After completing lesson, the new grammar point will be added to your review schedule to help reinforce your learning over time.',
          position: "bottom",
        },
        {
          element: '[data-tour="reviews-card"]',
          title: "Review Your Knowledge",
          intro:
            "Push this button to start a new review session. Regular reviews use spaced repetition system to help you remember what you've learned.",
          position: "bottom",
        },
        {
          element: '[data-tour="streak-card"]',
          title: "Your Learning Streak",
          intro:
            "Keep your streak alive! This tracks how many consecutive days you've studied. Consistency is the key to mastering any language.",
          position: "bottom",
        },
        {
          element: '[data-tour="learn-card"]',
          title: "That's all for now!",
          intro: "Why don't you try to start a lesson?",
          position: "bottom",
        },
      ],
    });

    tour.onComplete(async () => {
      try {
        await actions.finishTour({ type: "dashboard" });
        console.log("Tour completed");
      } catch (e) {
        console.error("Failed to finish tour, please report an error :(", e);
      }
    });
    setTimeout(() => {
      tour?.start();
    }, 500);
  });

  onCleanup(() => {
    if (tour?.isActive()) {
      tour.exit(true);
    }
  });

  return null;
}
