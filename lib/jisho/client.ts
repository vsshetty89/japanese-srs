const JISHO_API = 'https://jisho.org/api/v1/search/words';

export async function lookupJisho(keyword: string): Promise<object | null> {
  try {
    const url = `${JISHO_API}?keyword=${encodeURIComponent(keyword)}`;
    const res = await fetch(url, { next: { revalidate: 86400 } });
    if (!res.ok) return null;
    const data = await res.json();
    return data?.data?.[0] ?? null;
  } catch {
    return null;
  }
}
