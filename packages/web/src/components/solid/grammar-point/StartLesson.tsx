import { Play } from "ui/icons";

export const StartLesson = () => {
  return (
    <a
      class="fixed right-[16px] bottom-[16px] z-50 flex h-[56px] w-[56px] items-center justify-center rounded-[16px] bg-primary fill-white shadow-md hover:opacity-80 hover:shadow-lg active:opacity-90 active:shadow-md md:top-[140px]"
      href="/sr/lesson/start"
    >
      <Play size={24} title="Start Lesson" />
    </a>
  );
};
