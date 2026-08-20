import { Context } from "auth";
import type { Exercise, ExercisePart } from "../exercise";

export type Example = [string, string, string];

export const Example = {
  fromExerciseParts: (exerciseParts: ExercisePart[]): Example => {
    const parts = exerciseParts.map((part) => part.text);
    if (parts.length < 3) {
      parts.push(...new Array(3 - parts.length).fill(""));
    }
    // TODO: enable more when we have more than 3 parts
    return parts.slice(0, 3) as Example;
  },
  replaceAnswer: ([a, _answer, b]: Example, newAnswer: string): Example => {
    return [a, newAnswer, b];
  },
  fromLegacy: (str: string): Example => {
    const regex = /(.*)%(.*?)%(.*)/;
    const matches = str.match(regex);

    if (matches) {
      return [matches[1] ?? "", matches[2] ?? "", matches[3] ?? ""];
    }
    return ["", "", ""];
  },
};

export type FullExample = {
  ru: Example;
  en: Example;
  order: number;
  hide: boolean;
};

const makeExample = (parts: ExercisePart[]) =>
  parts
    .toSorted((a, b) => a.index - b.index)
    .map((p) => p.text)
    .concat(new Array(3).fill(""))
    .slice(0, 3) as [string, string, string];

export const FullExample = {
  isVisible(example: FullExample, context: Context): boolean {
    if (example.hide) {
      return Context.isAdmin(context);
    }
    return true;
  },
  fromExercise(exercise: Exercise): FullExample {
    return {
      ru: makeExample(exercise.parts),
      en: makeExample(exercise.translationParts),
      order: exercise.order,
      hide: exercise.hide,
    };
  },
};

export const FullExamples = {
  filterVisible(examples: FullExample[], context: Context): FullExample[] {
    return examples.filter((example) =>
      FullExample.isVisible(example, context),
    );
  },
  fromExercises(exercises: Exercise[]): FullExample[] {
    return exercises.map((e) => FullExample.fromExercise(e));
  },
};
