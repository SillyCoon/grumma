declare module "@digitallinguistics/transliterate" {
  function transliterate(
    input: string,
    substitutions: Record<string, string>,
  ): string;
}
