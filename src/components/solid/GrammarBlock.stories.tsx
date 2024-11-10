import type { Meta, StoryObj } from "storybook-solidjs";
import { GrammarBlock } from "./GrammarBlock";
import { mockGrammarPoint } from "~/__mocks__";

const meta = {
	title: "Grammar Point/GrammarBlock",
	component: GrammarBlock,
	tags: ["autodocs"],
} satisfies Meta<typeof GrammarBlock>;

export default meta;
type Story = StoryObj<typeof GrammarBlock>;

const grammar = Array.from({ length: 50 }).map(() => ({
	...mockGrammarPoint(),
	inReview: true,
}));

export const Primary: Story = {
	args: {
		torfl: "A1",
		grammar,
	},
};
