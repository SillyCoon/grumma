type Stage = 0;
export type Drill = {
	grammarPointId: string;
	stage: number;
	achievedAt: Date;
};
export const Drill = (grammarPointId: string, stage: Stage): Drill => ({
	grammarPointId: grammarPointId,
	stage,
	achievedAt: new Date(),
});
