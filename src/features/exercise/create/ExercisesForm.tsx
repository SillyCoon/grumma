import {
  createSignal,
  For,
  Match,
  Show,
  Switch as SolidSwitch,
} from "solid-js";
import { Button } from "packages/ui/button";
import { unwrap } from "solid-js/store";
import { Answer, Text, type Exercise } from "~/features/exercise/domain";
import { actions } from "astro:actions";
import { toast } from "solid-toast";
import { exercisesStore } from "./domain";
import {
  Switch,
  SwitchControl,
  SwitchLabel,
  SwitchThumb,
} from "packages/ui/switch";
import { ResetConfirmation } from "@components/common/ResetConfirmation";
import { IconButton } from "packages/ui/icon-button";
import { AiFillEye, AiFillEyeInvisible } from "solid-icons/ai";
import { Tooltip, TooltipContent, TooltipTrigger } from "packages/ui/tooltip";
import { ExercisePreview } from "./ExercisePreview";
import { ExerciseInput } from "./ExerciseInput";

const EmptyExercise = (order: number): Exercise => ({
  order,
  hide: true,
  parts: [
    Text(0, "Левая часть предложения "),
    Answer(1, "ответ"),
    Text(2, " правая часть предложения."),
  ],
  translationParts: [
    Text(0, "Left part of the sentence "),
    Answer(1, "answer"),
    Text(2, " right part of the sentence."),
  ],
});

export const ExercisesForm = (props: {
  grammarPointId: number;
  defaultExercises?: Exercise[];
  isEditing?: boolean;
}) => {
  const [isEditing, setIsEditing] = createSignal(props.isEditing ?? false);

  const MAX_EXERCISES = 12;
  const { exercises, setExercises, toggleHideExercise, clear } = exercisesStore(
    props.grammarPointId,
    structuredClone(unwrap(props.defaultExercises)) ?? [],
  );
  const [previewExercises, setPreviewExercises] = createSignal<Exercise[]>(
    props.defaultExercises ?? [],
  );

  const hasCapacity = () => exercises.length < MAX_EXERCISES;
  return (
    <div>
      <div class="mb-4 ml-auto flex w-fit flex-row gap-2">
        <Switch
          checked={isEditing()}
          onChange={setIsEditing}
          class="flex items-center space-x-2"
        >
          <SwitchControl>
            <SwitchThumb />
          </SwitchControl>
          <SwitchLabel>Edit mode</SwitchLabel>
        </Switch>
      </div>

      <ol class="list-decimal pl-5">
        <SolidSwitch>
          <Match when={isEditing()}>
            <For each={exercises}>
              {(exercise, index) => {
                const setExercise = setExercises.bind(null, index());

                return (
                  <li>
                    <div class="flex flex-row justify-between">
                      <ExerciseInput
                        exercise={exercise}
                        setExercise={setExercise}
                      />
                      <Tooltip>
                        <TooltipTrigger>
                          <IconButton
                            variant={exercise.hide ? "warning" : "success"}
                            onClick={() => toggleHideExercise(index())}
                          >
                            <Show
                              when={!exercise.hide}
                              fallback={<AiFillEyeInvisible />}
                            >
                              <AiFillEye />
                            </Show>
                          </IconButton>
                        </TooltipTrigger>
                        <TooltipContent>
                          {exercise.hide
                            ? "Hidden from users"
                            : "Visible to users"}
                        </TooltipContent>
                      </Tooltip>
                    </div>
                  </li>
                );
              }}
            </For>
          </Match>
          <Match when={!isEditing()}>
            <For each={previewExercises()}>
              {(exercise) => {
                return (
                  <li>
                    <ExercisePreview exercise={exercise} />
                  </li>
                );
              }}
            </For>
          </Match>
        </SolidSwitch>
        <Show when={isEditing()}>
          <Button
            variant={"ghost"}
            disabled={!hasCapacity()}
            class="w-full"
            onClick={() =>
              setExercises(
                exercises.length,
                EmptyExercise(exercises.length + 1),
              )
            }
          >
            <Show
              when={hasCapacity()}
              fallback={`Max number of exercises is ${MAX_EXERCISES}`}
            >
              + Add exercise
            </Show>
          </Button>
          <div class="mt-4 ml-auto flex w-fit flex-row gap-2">
            <Tooltip>
              <TooltipTrigger>
                <ResetConfirmation
                  title="exercises"
                  onReset={() => {
                    clear();
                    globalThis.location.reload();
                  }}
                />
              </TooltipTrigger>
              <TooltipContent>Clear all local changes</TooltipContent>
            </Tooltip>

            <Button
              onClick={async () => {
                try {
                  const result = await actions.putExercises({
                    grammarPointId: props.grammarPointId,
                    exercises: unwrap(exercises),
                  });
                  if (result.error) {
                    console.error(result.error);
                    toast.error("Failed to save exercises");
                  } else {
                    setPreviewExercises(exercises);
                    clear();
                    toast.success("Exercises saved successfully");
                  }
                } catch {
                  toast.error("Failed to save exercises");
                }
              }}
            >
              Save Exercises
            </Button>
          </div>
        </Show>
      </ol>
    </div>
  );
};
