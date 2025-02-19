import Confetti from "canvas-confetti";
import { createSignal, onCleanup, onMount } from "solid-js";

export default function CongratulationsScreen(props: { class?: string }) {
  const [showConfetti, setShowConfetti] = createSignal(true);

  onMount(() => {
    Confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });

    const timer = setTimeout(() => setShowConfetti(false), 5000);
    onCleanup(() => clearTimeout(timer));
  });

  return (
    <div
      class={`relative flex-col items-center justify-center text-center ${props.class}`}
    >
      {showConfetti() && <div id="confetti-container" />}

      <div class="absolute inset-0 overflow-hidden">
        <div class="firework top-10 left-1/4" />
        <div class="firework top-20 right-1/4" />
        <div class="firework top-1/2 left-1/3" />
      </div>

      <h1 class="font-bold text-4xl text-secondary drop-shadow-lg">
        Congratulations! 🎉
      </h1>
      <p class="mt-4 text-lg text-secondary drop-shadow-lg">
        You have learned all available grammar points!
      </p>
      <p class="mt-2 text-lg text-secondary drop-shadow-lg">
        More grammar points will be added in the future, so keep practicing!
      </p>
    </div>
  );
}
