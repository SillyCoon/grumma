import { addHour, hourStart } from "@formkit/tempo";

type DayInterval = [
	Date,
	Date,
	Date,
	Date,
	Date,
	Date,
	Date,
	Date,
	Date,
	Date,
	Date,
	Date,
	Date,
	Date,
	Date,
	Date,
	Date,
	Date,
	Date,
	Date,
	Date,
	Date,
	Date,
	Date,
];

export const generate24HourInterval = (date: Date): DayInterval => {
	const nextHour = hourStart(addHour(date));

	const generate = (acc: Date[], i: number): DayInterval => {
		if (i === 24) return acc as DayInterval;
		return generate([...acc, addHour(nextHour, i)], i + 1);
	};

	return generate([], 0);
};
