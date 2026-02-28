const KANJI_REGEX = /[\u4E00-\u9FFF]/g;

export function extractKanji(text: string): string[] {
  const matches = text.match(KANJI_REGEX);
  if (!matches) return [];
  return Array.from(new Set(matches));
}
