'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import type { Sentence, SRSCard } from '@/types';

interface KanjiData {
  id: number;
  character: string;
  jisho_data: string | null;
}

interface JishoData {
  japanese?: { reading?: string }[];
  senses?: { english_definitions?: string[]; parts_of_speech?: string[] }[];
}

export default function KanjiDetailPage({ params }: { params: { id: string } }) {
  const [data, setData] = useState<{ kanji: KanjiData; cards: { reading: SRSCard; meaning: SRSCard }; sentences: Sentence[] } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/kanji/${params.id}`)
      .then(r => r.json())
      .then(setData)
      .finally(() => setLoading(false));
  }, [params.id]);

  if (loading) return <div className="max-w-xl mx-auto py-8 px-4 text-gray-400">Loading...</div>;
  if (!data) return <div className="max-w-xl mx-auto py-8 px-4 text-red-500">Not found.</div>;

  const { kanji, cards, sentences } = data;
  let jisho: JishoData | null = null;
  try { if (kanji.jisho_data) jisho = JSON.parse(kanji.jisho_data); } catch {}

  const nextReview = (card: SRSCard) => new Date(card.due_date * 1000).toLocaleDateString();

  return (
    <div className="max-w-xl mx-auto py-8 px-4">
      <Link href="/kanji" className="text-sm text-indigo-600 hover:underline mb-6 block">← Back</Link>

      <div className="bg-white rounded-2xl shadow p-8 mb-6 text-center">
        <div className="text-8xl mb-4">{kanji.character}</div>
        {jisho && (
          <>
            {jisho.japanese?.[0]?.reading && (
              <div className="text-lg text-gray-500 mb-2">{jisho.japanese[0].reading}</div>
            )}
            {jisho.senses && (
              <div className="mt-4 text-left">
                {jisho.senses.slice(0, 3).map((s, i) => (
                  <div key={i} className="mb-2">
                    <span className="text-xs text-gray-400">{i + 1}. </span>
                    <span className="text-gray-700">{s.english_definitions?.join(', ')}</span>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {(cards.reading || cards.meaning) && (
        <div className="bg-white rounded-xl shadow p-5 mb-6">
          <h3 className="font-semibold mb-3 text-sm text-gray-500 uppercase tracking-wide">SRS Status</h3>
          <div className="grid grid-cols-2 gap-4">
            {(['reading', 'meaning'] as const).map(type => {
              const card = cards[type] as SRSCard | undefined;
              if (!card) return null;
              return (
                <div key={type} className="bg-gray-50 rounded-lg p-3">
                  <div className="text-xs font-medium text-gray-500 capitalize mb-1">{type}</div>
                  <div className="text-sm">Next: {nextReview(card)}</div>
                  <div className="text-xs text-gray-400">Interval: {card.interval}d · Rep: {card.repetitions}</div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {sentences.length > 0 && (
        <div className="bg-white rounded-xl shadow p-5">
          <h3 className="font-semibold mb-3 text-sm text-gray-500 uppercase tracking-wide">Example Sentences</h3>
          <div className="space-y-2">
            {sentences.map(s => (
              <p key={s.id} className="text-sm text-gray-700 bg-gray-50 rounded p-2">{s.text}</p>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
