'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Vocab {
  id: number;
  surface_form: string;
  basic_form: string;
  reading: string;
  pos: string;
}

export default function VocabPage() {
  const [vocab, setVocab] = useState<Vocab[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/vocab')
      .then(r => r.json())
      .then(data => {
        setVocab(data.vocab ?? []);
        setTotal(data.total ?? 0);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-zinc-100">Vocabulary</h1>
          {!loading && <p className="text-zinc-500 text-sm">{total} words</p>}
        </div>
        <Link href="/" className="text-sm text-violet-400 hover:underline">← Home</Link>
      </div>

      {loading ? (
        <p className="text-zinc-500">Loading...</p>
      ) : vocab.length === 0 ? (
        <div className="text-center py-16 text-zinc-500">
          <p className="text-lg mb-4">No vocabulary yet.</p>
          <Link href="/log" className="text-violet-400 hover:underline">Add your first sentence →</Link>
        </div>
      ) : (
        <div className="space-y-2">
          {vocab.map(v => (
            <Link
              key={v.id}
              href={`/vocab/${v.id}`}
              className="flex items-center justify-between bg-zinc-900 border border-zinc-800 rounded-lg p-4 hover:border-violet-700 transition"
            >
              <div className="flex items-center gap-4">
                <span className="text-xl text-zinc-100">{v.surface_form}</span>
                <span className="text-zinc-500 text-sm">{v.reading}</span>
              </div>
              <span className="text-xs bg-zinc-800 text-zinc-400 px-2 py-1 rounded">{v.pos}</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
