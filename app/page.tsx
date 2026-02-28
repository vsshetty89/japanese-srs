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
      <h1 className="text-3xl font-bold mb-2">日本語 SRS</h1>
      <p className="text-gray-500 mb-8">Your Japanese spaced repetition system</p>

      {stats && stats.due_today > 0 && (
        <Link
          href="/review"
          className="block mb-6 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl p-5 transition"
        >
          <div className="flex items-center justify-between">
            <div>
              <div className="text-lg font-semibold">Review Due Cards</div>
              <div className="text-indigo-200 text-sm">{stats.due_today} card{stats.due_today !== 1 ? 's' : ''} waiting</div>
            </div>
            <span className="text-3xl font-bold">{stats.due_today}</span>
          </div>
        </Link>
      )}

      {stats && stats.due_today === 0 && stats.total_cards > 0 && (
        <div className="mb-6 bg-green-50 border border-green-200 rounded-xl p-5">
          <div className="text-green-700 font-semibold">All caught up!</div>
          <div className="text-green-600 text-sm">No cards due right now.</div>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4 mb-8">
        {stats ? (
          statCards.map(card => (
            card.href ? (
              <Link
                key={card.label}
                href={card.href}
                className="bg-white rounded-xl shadow p-5 hover:shadow-md transition"
              >
                <div className="text-3xl font-bold text-indigo-700">{card.value}</div>
                <div className="text-gray-500 text-sm mt-1">{card.label}</div>
              </Link>
            ) : (
              <div key={card.label} className="bg-white rounded-xl shadow p-5">
                <div className="text-3xl font-bold text-gray-700">{card.value}</div>
                <div className="text-gray-500 text-sm mt-1">{card.label}</div>
              </div>
            )
          ))
        ) : (
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-white rounded-xl shadow p-5 animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-12 mb-2" />
              <div className="h-4 bg-gray-100 rounded w-20" />
            </div>
          ))
        )}
      </div>

      <div className="flex gap-3">
        <Link
          href="/log"
          className="flex-1 bg-white border border-gray-200 hover:border-indigo-400 rounded-xl p-4 text-center transition"
        >
          <div className="font-medium">Log Sentence</div>
          <div className="text-xs text-gray-400 mt-1">Add new content</div>
        </Link>
        <Link
          href="/vocab"
          className="flex-1 bg-white border border-gray-200 hover:border-indigo-400 rounded-xl p-4 text-center transition"
        >
          <div className="font-medium">Browse Vocab</div>
          <div className="text-xs text-gray-400 mt-1">View vocabulary</div>
        </Link>
        <Link
          href="/kanji"
          className="flex-1 bg-white border border-gray-200 hover:border-indigo-400 rounded-xl p-4 text-center transition"
        >
          <div className="font-medium">Browse Kanji</div>
          <div className="text-xs text-gray-400 mt-1">View characters</div>
        </Link>
      </div>
    </div>
  );
}
