/**
 * Extracts the first sentence of a string.
 *
 * @param input String to extract excerpt from
 * @returns First sentence of string, or undefined if no sentence is found
 */
export function getExcerpt(input: string): string | undefined {
  const rawBody = input.trim();
  // Targeting first punctuation mark followed by a space.
  const matches = rawBody.match(/([\.\!\?])(?=[\ ])/);
  if (!matches) return;
  // First punctuation character
  const firstPunctuation = matches[0];
  // Raw input is the first segment before the punctuation, plus the punctuation
  // character.
  return rawBody.split(firstPunctuation)[0] + firstPunctuation;
}
