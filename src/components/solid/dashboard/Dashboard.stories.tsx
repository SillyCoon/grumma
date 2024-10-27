import type { Meta, StoryObj } from "storybook-solidjs";
import { Dashboard } from "./Dashboard";

const meta = {
	title: "User/Dashboard",
	component: Dashboard,
	tags: ["autodocs"],
} satisfies Meta<typeof Dashboard>;

export default meta;
type Story = StoryObj<typeof Dashboard>;

export const Primary: Story = {
	args: {
		date: new Date("2020-10-10T08:00:00"),
		schedule: [
			{
				grammarPointId: "1",
				availableAt: new Date("2020-10-10T10:00:00"),
				stage: 1,
			},
			{
				grammarPointId: "1",
				availableAt: new Date("2020-10-10T11:00:00"),
				stage: 1,
			},
			{
				grammarPointId: "1",
				availableAt: new Date("2020-10-10T11:10:00"),
				stage: 1,
			},
			{
				grammarPointId: "1",
				availableAt: new Date("2020-10-11T01:10:00"),
				stage: 1,
			},
		],
	},
};
