export class GrammarPointsLoaderError extends Error {
  constructor(
    message: string,
    public code?: number,
  ) {
    super(message);
    this.name = "GrammarPointsLoaderError";
  }
}
export class GrammarPointNotFoundError extends GrammarPointsLoaderError {
  constructor(message: string) {
    super(message);
    this.name = "GrammarPointNotFoundError";
    this.code = 404;
  }
}
