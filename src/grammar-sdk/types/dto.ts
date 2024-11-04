export interface ExerciseDto {
	en: string;
	ru: string;
	helper: string | null;
}

export interface GrammarPointDto {
	id: {
		number: number;
		prefix?: string;
	};
	title: string;
	structure: string;
	order?: number;
	exercises: ExerciseDto[];
}

export interface GrammarPointDb {
	id: number;
	title: string;
	structure: string | null;
	order: number | null;
	exercises: ExerciseDto[];
}
