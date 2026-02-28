'use client';

import { useState } from 'react';

interface CardData {
  id: number;
  item_type: string;
  card_type: string;
  display: string;
  basic_form: string;
  reading: string;
  jisho_data: string | null;
  interval: number;
  repetitions: number;
}

interface Props {
  card: CardData;
  onSubmit: (card_id: number, quality: number) => void;
}

export default function ReviewCard({ card, onSubmit }: Props) {
  const [revealed, setRevealed] = useState(false);

  let jisho: { japanese?: { reading?: string }[]; senses?: { english_definitions?: string[] }[] } | null = null;
  try {
    if (card.jisho_data) jisho = JSON.parse(card.jisho_data);
  } catch {}

  const answer =
    card.card_type === 'reading'
      ? (jisho?.japanese?.[0]?.reading ?? card.reading)
      : (jisho?.senses?.[0]?.english_definitions?.join(', ') ?? card.basic_form);

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 text-center">
      <div className="text-xs uppercase tracking-widest text-zinc-500 mb-2">
        {card.item_type} · {card.card_type}
      </div>
      <div className="text-6xl mb-6 py-4 text-zinc-100">{card.display}</div>

      {!revealed ? (
        <button
          onClick={() => setRevealed(true)}
          className="bg-zinc-800 hover:bg-zinc-700 text-zinc-300 px-8 py-3 rounded-xl font-medium transition"
        >
          Show Answer
        </button>
      ) : (
        <div>
          <div className="text-2xl text-violet-400 font-semibold mb-6">{answer}</div>
          <QualityButtons onSelect={q => onSubmit(card.id, q)} />
        </div>
      )}
    </div>
  );
}

function QualityButtons({ onSelect }: { onSelect: (q: number) => void }) {
  const buttons = [
    { q: 0, label: 'Blackout', color: 'bg-red-700 hover:bg-red-600' },
    { q: 1, label: 'Wrong', color: 'bg-orange-700 hover:bg-orange-600' },
    { q: 2, label: 'Hard', color: 'bg-yellow-700 hover:bg-yellow-600' },
    { q: 3, label: 'Good', color: 'bg-emerald-700 hover:bg-emerald-600' },
    { q: 4, label: 'Easy', color: 'bg-sky-700 hover:bg-sky-600' },
    { q: 5, label: 'Perfect', color: 'bg-violet-700 hover:bg-violet-600' },
  ];

  return (
    <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
      {buttons.map(b => (
        <button
          key={b.q}
          onClick={() => onSelect(b.q)}
          className={`${b.color} text-white py-2 px-3 rounded-lg text-sm font-medium transition`}
        >
          {b.label}
        </button>
      ))}
    </div>
  );
}
