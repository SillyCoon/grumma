import { Storage } from "@google-cloud/storage";
import type { GrammarPoint } from "src/grammar-sdk";

export type GrammarPointType = GrammarPoint;

// TODO: move to grammar service
export const fetchExplanation = async (id: number | string) => {
	try {
		const storage = new Storage();
		const bucket = storage.bucket("sonyona");
		const file = bucket.file(`SON-${id}.html`);
		const [exists] = await file.exists();
		if (exists) {
			const [data] = await file.download();
			return data.toString();
		}
		return "";
	} catch (e) {
		console.log(`Can't fetch file from Cloud Storage with id ${id}`, e);
	}
};
