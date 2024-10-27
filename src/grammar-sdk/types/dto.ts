export interface ExerciseDto {
	en: string;
	ru: string;
	helper: string;
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

export interface GrammarPointDtoFromDB {
	id: number;
	title: string;
	structure: string;
	order?: number;
	exercises: ExerciseDto[];
}
