import {
  createEffect,
  createSignal,
  For,
  Match,
  Show,
  Switch as SolidSwitch,
} from "solid-js";
import { Button } from "ui/button";
import { unwrap } from "solid-js/store";
import { Answer, Text, type Exercise } from "grammar-sdk/exercise";
import { actions } from "astro:actions";
import { toast } from "solid-toast";
import { exercisesStore } from "./domain";
import { Switch, SwitchControl, SwitchLabel, SwitchThumb } from "ui/switch";
import { ResetConfirmation } from "@components/common/ResetConfirmation";
import { IconButton } from "ui/icon-button";
import { AiFillEye, AiFillEyeInvisible } from "solid-icons/ai";
import { Tooltip, TooltipContent, TooltipTrigger } from "ui/tooltip";
import { ExercisePreview } from "./ExercisePreview";
import { ExerciseInput } from "./ExerciseInput";
import { RiEditorDraggable } from "solid-icons/ri";

const EmptyExercise = (order: number, grammarPointId: number): Exercise => ({
  grammarPointId: grammarPointId.toString(),
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

const filterEmptyParts = (exercise: Exercise): Exercise => ({
  ...exercise,
  parts: exercise.parts.filter(
    (part) => !(part.type === "text" && part.text.trim() === ""),
  ),
  translationParts: exercise.translationParts.filter(
    (part) => !(part.type === "text" && part.text.trim() === ""),
  ),
});

const filterEmptyAcceptableAnswers = (exercise: Exercise): Exercise => {
  const filterFn = (part: Answer | Text) => {
    if (part.type === "answer") {
      return {
        ...part,
        acceptableAnswers: part.acceptableAnswers?.filter(
          (answer) => answer.text.trim() !== "",
        ),
      };
    }
    return part;
  };

  return {
    ...exercise,
    parts: exercise.parts.map(filterFn),
    translationParts: exercise.translationParts.map(filterFn),
  };
};

export const ExercisesForm = (props: {
  grammarPointId: number;
  defaultExercises?: Exercise[];
  isEditing?: boolean;
}) => {
  const [isEditing, setIsEditing] = createSignal(props.isEditing ?? false);

  const MAX_EXERCISES = 12;
  const {
    exercises,
    setExercises,
    toggleHideExercise,
    clear,
    disableSorting,
    parent,
  } = exercisesStore(
    props.grammarPointId,
    structuredClone(unwrap(props.defaultExercises)) ?? [],
  );

  const [previewExercises, setPreviewExercises] = createSignal<Exercise[]>(
    props.defaultExercises ?? [],
  );

  createEffect(() => {
    disableSorting(!isEditing());
  });

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

      <ol class="list-decimal pl-5" ref={parent}>
        <SolidSwitch>
          <Match when={isEditing()}>
            <For each={exercises}>
              {(exercise, index) => {
                const setExercise = setExercises.bind(null, index());

                return (
                  <div class="flex flex-row items-center gap-10">
                    <RiEditorDraggable class="drag-handle cursor-grab active:cursor-grabbing" />

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
                  </div>
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
      </ol>
      <Show when={isEditing()}>
        <Button
          id="non-draggable"
          variant={"ghost"}
          disabled={!hasCapacity()}
          class="w-full"
          onClick={() =>
            setExercises(
              exercises.length,
              EmptyExercise(exercises.length, props.grammarPointId),
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
                const result = await actions.putExercises(
                  unwrap(exercises)
                    .map(filterEmptyParts)
                    .map(filterEmptyAcceptableAnswers)
                    .map((exercise, index) => ({
                      ...exercise,
                      order: index,
                    })),
                );
                if (result.error) {
                  console.error(result.error);
                  toast.error("Failed to save exercises");
                } else {
                  setPreviewExercises(result.data);
                  setExercises(result.data);
                  clear();
                  toast.success("Exercises saved successfully");
                }
              } catch (error) {
                console.error(error);
                toast.error("Failed to save exercises");
              }
            }}
          >
            Save Exercises
          </Button>
        </div>
      </Show>
    </div>
  );
};
