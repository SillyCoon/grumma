export const parseToExercise = (str: string) => {
	return str
		.replaceAll(/%([^%]+)%/g, (_, grammar) => `%#${grammar}%`)
		.split("%")
		.map((p) => p.trim())
		.map((part) => {
			if (part.includes("#"))
				return { type: "grammar", text: ` ${part.replace("#", "")} ` } as const;
			return { type: "text", text: part } as const;
		});
};

export const normalizeAnswer = (str: string) => str.trim().toLowerCase();
