import { onCleanup } from "solid-js";

export function useDebounce<T>(
  signalSetter: (value: T) => void,
  delay: number,
) {
  let timerHandle: Timer;
  function debouncedSignalSetter(value: T) {
    clearTimeout(timerHandle);
    timerHandle = setTimeout(() => signalSetter(value), delay);
  }
  onCleanup(() => clearInterval(timerHandle));
  return debouncedSignalSetter;
}
