'use client';

import { useEffect, useState } from 'react';
import ReviewCard from '@/components/ReviewCard';
import ReviewProgress from '@/components/ReviewProgress';
import Link from 'next/link';

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

export default function ReviewPage() {
  const [cards, setCards] = useState<CardData[]>([]);
  const [, setTotalDue] = useState(0);
  const [done, setDone] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetch('/api/review')
      .then(r => r.json())
      .then(data => {
        setCards(data.cards ?? []);
        setTotalDue(data.total_due ?? 0);
      })
      .finally(() => setLoading(false));
  }, []);

  async function handleSubmit(cardId: number, quality: number) {
    setSubmitting(true);
    await fetch('/api/review/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ card_id: cardId, quality }),
    });
    setCards(prev => prev.filter(c => c.id !== cardId));
    setDone(d => d + 1);
    setSubmitting(false);
  }

  if (loading) {
    return (
      <div className="max-w-xl mx-auto py-16 px-4 text-center text-zinc-500">
        Loading review session...
      </div>
    );
  }

  const currentCard = cards[0];

  return (
    <div className="max-w-xl mx-auto py-8 px-4">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold text-zinc-100">Review</h1>
        <Link href="/" className="text-sm text-violet-400 hover:underline">← Home</Link>
      </div>

      <ReviewProgress done={done} total={done + cards.length} />

      {currentCard ? (
        <ReviewCard
          key={currentCard.id}
          card={currentCard}
          onSubmit={submitting ? () => {} : handleSubmit}
        />
      ) : (
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 text-center">
          {done > 0 ? (
            <>
              <div className="text-4xl mb-4">烏</div>
              <h2 className="text-xl font-semibold mb-2 text-zinc-100">Session Complete!</h2>
              <p className="text-zinc-400">You reviewed {done} card{done !== 1 ? 's' : ''}.</p>
            </>
          ) : (
            <>
              <div className="text-4xl mb-4">烏</div>
              <h2 className="text-xl font-semibold mb-2 text-zinc-100">All Caught Up!</h2>
              <p className="text-zinc-400">No cards due right now.</p>
            </>
          )}
          <Link href="/log" className="mt-6 inline-block bg-violet-700 hover:bg-violet-600 text-white px-6 py-2 rounded-lg transition">
            Add More Sentences
          </Link>
        </div>
      )}
    </div>
  );
}
