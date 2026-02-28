import kuromoji from 'kuromoji';

type Tokenizer = kuromoji.Tokenizer<kuromoji.IpadicFeatures>;

declare global {
  // eslint-disable-next-line no-var
  var __tokenizer: Tokenizer | undefined;
}

export function getTokenizer(): Promise<Tokenizer> {
  if (globalThis.__tokenizer) {
    return Promise.resolve(globalThis.__tokenizer);
  }

  return new Promise((resolve, reject) => {
    kuromoji.builder({ dicPath: 'node_modules/kuromoji/dict' }).build((err, tokenizer) => {
      if (err) {
        reject(err);
        return;
      }
      globalThis.__tokenizer = tokenizer;
      resolve(tokenizer);
    });
  });
}

export interface TokenResult {
  surface_form: string;
  basic_form: string;
  reading: string;
  pos: string;
}

const SKIP_POS = new Set(['助詞', '助動詞', '記号', 'フィラー', 'その他']);

export async function tokenize(text: string): Promise<TokenResult[]> {
  const tokenizer = await getTokenizer();
  const tokens = tokenizer.tokenize(text);

  return tokens
    .filter(t => {
      const pos = t.pos;
      return !SKIP_POS.has(pos) && t.basic_form !== '*' && t.basic_form.trim() !== '';
    })
    .map(t => ({
      surface_form: t.surface_form,
      basic_form: t.basic_form,
      reading: t.reading ?? t.surface_form,
      pos: t.pos,
    }));
}
