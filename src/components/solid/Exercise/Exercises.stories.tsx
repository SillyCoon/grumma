import type { Meta, StoryObj } from "storybook-solidjs";
import { Exercises } from "../Exercise/Exercises";

const meta = {
	title: "Example/Exercises",
	component: Exercises,
	tags: ["autodocs"],
} satisfies Meta<typeof Exercises>;

export default meta;
type Story = StoryObj<typeof Exercises>;

export const Primary: Story = {
	args: {
		exercises: [
			{
				order: 1,
				ru: "Я %ловлю% Соненов",
				ruGrammar: "",
				enGrammar: "",
				en: "I %love% Sonyonov",
				draft: "",
				grammarPointId: "1",
			},
			{
				order: 2,
				ru: "%Ты% Сонена",
				ruGrammar: "",
				enGrammar: "",
				en: "%You% are Sonyonov",
				draft: "am",
				grammarPointId: "2",
			},
			{
				order: 5,
				ru: "%Я% не Сонена",
				ruGrammar: "",
				enGrammar: "",
				en: "%I% am not Sonyonov",
				draft: "am",
				grammarPointId: "3",
			},
		],
	},
};
