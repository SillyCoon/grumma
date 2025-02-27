import type { Meta, StoryObj } from "storybook-solidjs";

import { mockAttempt } from "space-repetition/__mocks__";
import { mockExample, mockGrammarPoint } from "grammar-sdk/__mocks__";
import { SessionResult } from "../../../src/components/solid/Exercise/SessionResult";

// More on how to set up stories at: https://storybook.js.org/docs/7.0/solid/writing-stories/introduction
const meta = {
  title: "SessionResult",
  component: SessionResult,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
    layout: "padded",
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ["autodocs"],
  // More on argTypes: https://storybook.js.org/docs/api/argtypes
  // Use `fn` to spy on the onClick arg, which will appear in the actions panel once invoked: https://storybook.js.org/docs/essentials/actions#action-args
} satisfies Meta<typeof SessionResult>;

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/solid/writing-stories/args
export const Primary: Story = {
  args: {
    grammar: [
      mockGrammarPoint({
        id: "1",
        examples: [
          { ru: mockExample(), en: mockExample(), order: 1 },
          { ru: mockExample(), en: mockExample(), order: 2 },
        ],
      }),
      mockGrammarPoint({
        id: "2",
        examples: [{ ru: mockExample(), en: mockExample(), order: 4 }],
      }),
    ],
    sessionResult: {
      total: 10,
      correct: 5,
      attempts: [
        mockAttempt({ stage: 1, grammarPointId: "1", isCorrect: true }),
        mockAttempt({ stage: 2, grammarPointId: "1", isCorrect: false }),
        mockAttempt({ stage: 4, grammarPointId: "2", isCorrect: false }),
      ],
    },
  },
};
