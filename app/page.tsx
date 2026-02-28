'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Stats {
  sentences: number;
  vocab: number;
  kanji: number;
  due_today: number;
  total_cards: number;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    fetch('/api/stats')
      .then(r => r.json())
      .then(setStats);
  }, []);

  const statCards = stats
    ? [
        { label: 'Sentences', value: stats.sentences, href: '/log' },
        { label: 'Vocabulary', value: stats.vocab, href: '/vocab' },
        { label: 'Kanji', value: stats.kanji, href: '/kanji' },
        { label: 'SRS Cards', value: stats.total_cards, href: null },
      ]
    : [];

  return (
    <div className="max-w-2xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-1 text-zinc-100">烏 Karasu</h1>
      <p className="text-zinc-500 mb-8">Japanese spaced repetition</p>

      {stats && stats.due_today > 0 && (
        <Link
          href="/review"
          className="block mb-6 bg-violet-700 hover:bg-violet-600 text-white rounded-xl p-5 transition"
        >
          <div className="flex items-center justify-between">
            <div>
              <div className="text-lg font-semibold">Review Due Cards</div>
              <div className="text-violet-300 text-sm">{stats.due_today} card{stats.due_today !== 1 ? 's' : ''} waiting</div>
            </div>
            <span className="text-3xl font-bold">{stats.due_today}</span>
          </div>
        </Link>
      )}

      {stats && stats.due_today === 0 && stats.total_cards > 0 && (
        <div className="mb-6 bg-zinc-900 border border-zinc-700 rounded-xl p-5">
          <div className="text-zinc-300 font-semibold">All caught up!</div>
          <div className="text-zinc-500 text-sm">No cards due right now.</div>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4 mb-8">
        {stats ? (
          statCards.map(card => (
            card.href ? (
              <Link
                key={card.label}
                href={card.href}
                className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 hover:border-violet-700 transition"
              >
                <div className="text-3xl font-bold text-violet-400">{card.value}</div>
                <div className="text-zinc-500 text-sm mt-1">{card.label}</div>
              </Link>
            ) : (
              <div key={card.label} className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
                <div className="text-3xl font-bold text-zinc-300">{card.value}</div>
                <div className="text-zinc-500 text-sm mt-1">{card.label}</div>
              </div>
            )
          ))
        ) : (
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 animate-pulse">
              <div className="h-8 bg-zinc-700 rounded w-12 mb-2" />
              <div className="h-4 bg-zinc-800 rounded w-20" />
            </div>
          ))
        )}
      </div>

      <div className="flex gap-3">
        <Link href="/log" className="flex-1 bg-zinc-900 border border-zinc-800 hover:border-violet-700 rounded-xl p-4 text-center transition">
          <div className="font-medium text-zinc-200">Log Sentence</div>
          <div className="text-xs text-zinc-500 mt-1">Add new content</div>
        </Link>
        <Link href="/vocab" className="flex-1 bg-zinc-900 border border-zinc-800 hover:border-violet-700 rounded-xl p-4 text-center transition">
          <div className="font-medium text-zinc-200">Browse Vocab</div>
          <div className="text-xs text-zinc-500 mt-1">View vocabulary</div>
        </Link>
        <Link href="/kanji" className="flex-1 bg-zinc-900 border border-zinc-800 hover:border-violet-700 rounded-xl p-4 text-center transition">
          <div className="font-medium text-zinc-200">Browse Kanji</div>
          <div className="text-xs text-zinc-500 mt-1">View characters</div>
        </Link>
      </div>
    </div>
  );
}
