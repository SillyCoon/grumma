import type { Context } from "../context";
import type { ExercisePart } from "../exercise";

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
  replaceAnswer: ([a, answer, b]: Example, newAnswer: string): Example => {
    return [a, answer.replaceAll(/\p{L}+/gu, newAnswer), b];
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

export const FullExample = {
  isVisible(example: FullExample, context: Context): boolean {
    if (example.hide) {
      return context.user.role === "admin";
    }
    return true;
  },
};

export const FullExamples = {
  filterVisible(examples: FullExample[], context: Context): FullExample[] {
    return examples.filter((example) =>
      FullExample.isVisible(example, context),
    );
  },
};
