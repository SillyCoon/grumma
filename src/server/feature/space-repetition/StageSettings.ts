import type { Stage } from "./types/Stage";

const toMinutes = (num: number, units: "h" | "d"): number => {
	const hourToMinutes = (n: number) => n * 60;

	if (units === "h") return hourToMinutes(num);
	if (units === "d") return hourToMinutes(num * 24);
	return num;
};

export const StageSettings: Record<Stage, number> = {
	1: toMinutes(0, "h"),
	2: toMinutes(4, "h"),
	3: toMinutes(8, "h"),
	4: toMinutes(1, "d"),
	5: toMinutes(2, "d"),
	6: toMinutes(4, "d"),
	7: toMinutes(6, "d"),
	8: toMinutes(8, "d"),
	9: toMinutes(14, "d"),
	10: toMinutes(30, "d"),
	11: toMinutes(60, "d"),
	12: toMinutes(120, "d"),
};
