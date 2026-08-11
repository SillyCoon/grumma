import { defineLiveCollection } from "astro:content";
import { grammarPointsLoader } from "./features/grammar-point/loader";

const grammarPoints = defineLiveCollection({
  loader: grammarPointsLoader(),
});

export const collections = { grammarPoints };
