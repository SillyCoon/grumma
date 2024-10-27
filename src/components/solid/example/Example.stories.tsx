import type { Meta, StoryObj } from "storybook-solidjs";
import { Example } from "./Example";

const meta = {
	title: "Grammar Point/Example",
	component: Example,
	tags: ["autodocs"],
} satisfies Meta<typeof Example>;

export default meta;
type Story = StoryObj<typeof Example>;

export const Primary: Story = {
	args: {
		ru: ["Очень ", " осел ", " давно"],
		en: ["Long ", " ass ", " time ago"],
	},
};
