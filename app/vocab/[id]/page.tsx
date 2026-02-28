'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import type { Sentence, SRSCard } from '@/types';

interface Vocab {
  id: number;
  surface_form: string;
  basic_form: string;
  reading: string;
  pos: string;
  jisho_data: string | null;
}

interface JishoData {
  japanese?: { reading?: string; word?: string }[];
  senses?: { english_definitions?: string[]; parts_of_speech?: string[] }[];
}

export default function VocabDetailPage({ params }: { params: { id: string } }) {
  const [data, setData] = useState<{ vocab: Vocab; cards: { reading: SRSCard; meaning: SRSCard }; sentences: Sentence[] } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/vocab/${params.id}`)
      .then(r => r.json())
      .then(setData)
      .finally(() => setLoading(false));
  }, [params.id]);

  if (loading) return <div className="max-w-xl mx-auto py-8 px-4 text-zinc-500">Loading...</div>;
  if (!data) return <div className="max-w-xl mx-auto py-8 px-4 text-red-400">Not found.</div>;

  const { vocab, cards, sentences } = data;
  let jisho: JishoData | null = null;
  try { if (vocab.jisho_data) jisho = JSON.parse(vocab.jisho_data); } catch {}

  const nextReview = (card: SRSCard) => new Date(card.due_date * 1000).toLocaleDateString();

  return (
    <div className="max-w-xl mx-auto py-8 px-4">
      <Link href="/vocab" className="text-sm text-violet-400 hover:underline mb-6 block">← Back</Link>

      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 mb-6 text-center">
        <div className="text-6xl mb-2 text-zinc-100">{vocab.surface_form}</div>
        <div className="text-xl text-zinc-400 mb-1">{vocab.reading}</div>
        <div className="text-sm text-zinc-500">{vocab.basic_form} · {vocab.pos}</div>
        {jisho && jisho.senses && (
          <div className="mt-4 text-left">
            {jisho.senses.slice(0, 3).map((s, i) => (
              <div key={i} className="mb-2">
                <span className="text-xs text-zinc-500">{i + 1}. </span>
                <span className="text-zinc-300">{s.english_definitions?.join(', ')}</span>
                {s.parts_of_speech && s.parts_of_speech.length > 0 && (
                  <span className="ml-2 text-xs text-zinc-500">({s.parts_of_speech[0]})</span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {(cards.reading || cards.meaning) && (
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 mb-6">
          <h3 className="font-semibold mb-3 text-xs text-zinc-500 uppercase tracking-wide">SRS Status</h3>
          <div className="grid grid-cols-2 gap-4">
            {(['reading', 'meaning'] as const).map(type => {
              const card = cards[type] as SRSCard | undefined;
              if (!card) return null;
              return (
                <div key={type} className="bg-zinc-800 rounded-lg p-3">
                  <div className="text-xs font-medium text-zinc-400 capitalize mb-1">{type}</div>
                  <div className="text-sm text-zinc-200">Next: {nextReview(card)}</div>
                  <div className="text-xs text-zinc-500">Interval: {card.interval}d · Rep: {card.repetitions}</div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {sentences.length > 0 && (
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
          <h3 className="font-semibold mb-3 text-xs text-zinc-500 uppercase tracking-wide">Example Sentences</h3>
          <div className="space-y-2">
            {sentences.map(s => (
              <p key={s.id} className="text-sm text-zinc-300 bg-zinc-800 rounded p-2">{s.text}</p>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
