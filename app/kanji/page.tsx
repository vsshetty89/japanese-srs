'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Kanji {
  id: number;
  character: string;
  jisho_data: string | null;
}

export default function KanjiPage() {
  const [kanji, setKanji] = useState<Kanji[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<number | null>(null);

  useEffect(() => {
    fetch('/api/kanji')
      .then(r => r.json())
      .then(data => {
        setKanji(data.kanji ?? []);
        setTotal(data.total ?? 0);
      })
      .finally(() => setLoading(false));
  }, []);

  async function handleDelete(id: number) {
    setDeleting(id);
    await fetch(`/api/kanji/${id}`, { method: 'DELETE' });
    setKanji(prev => prev.filter(k => k.id !== id));
    setTotal(t => t - 1);
    setDeleting(null);
  }

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-zinc-100">Kanji</h1>
          {!loading && <p className="text-zinc-500 text-sm">{total} characters</p>}
        </div>
        <Link href="/" className="text-sm text-violet-400 hover:underline">← Home</Link>
      </div>

      {loading ? (
        <p className="text-zinc-500">Loading...</p>
      ) : kanji.length === 0 ? (
        <div className="text-center py-16 text-zinc-500">
          <p className="text-lg mb-4">No kanji yet.</p>
          <Link href="/log" className="text-violet-400 hover:underline">Add your first sentence →</Link>
        </div>
      ) : (
        <div className="grid grid-cols-5 sm:grid-cols-8 gap-2">
          {kanji.map(k => (
            <div key={k.id} className="relative group aspect-square">
              <Link
                href={`/kanji/${k.id}`}
                className="flex items-center justify-center w-full h-full text-2xl text-zinc-100 bg-zinc-900 border border-zinc-800 rounded-lg hover:border-violet-600 hover:text-violet-300 transition"
              >
                {k.character}
              </Link>
              <button
                onClick={() => handleDelete(k.id)}
                disabled={deleting === k.id}
                className="absolute top-0.5 right-0.5 text-[10px] text-zinc-600 hover:text-red-400 opacity-0 group-hover:opacity-100 disabled:opacity-40 transition leading-none"
                title="Delete"
              >
                {deleting === k.id ? '…' : '✕'}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
