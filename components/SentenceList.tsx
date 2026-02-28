'use client';

import { useEffect, useState } from 'react';
import type { Sentence } from '@/types';

interface Props {
  refreshKey: number;
}

export default function SentenceList({ refreshKey }: Props) {
  const [sentences, setSentences] = useState<Sentence[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<number | null>(null);

  useEffect(() => {
    setLoading(true);
    fetch('/api/sentences')
      .then(r => r.json())
      .then(data => setSentences(data.sentences ?? []))
      .finally(() => setLoading(false));
  }, [refreshKey]);

  async function handleDelete(id: number) {
    setDeleting(id);
    await fetch(`/api/sentences/${id}`, { method: 'DELETE' });
    setSentences(prev => prev.filter(s => s.id !== id));
    setDeleting(null);
  }

  if (loading) return <p className="text-zinc-500 text-sm">Loading...</p>;
  if (sentences.length === 0) return <p className="text-zinc-500 text-sm">No sentences yet.</p>;

  return (
    <div className="space-y-2">
      {sentences.map(s => (
        <div key={s.id} className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-lg text-zinc-100">{s.text}</p>
            <div className="flex items-center gap-3 mt-1 text-xs text-zinc-500">
              {s.source_tag && <span className="bg-zinc-800 px-2 py-0.5 rounded text-zinc-400">{s.source_tag}</span>}
              <span>{new Date(s.created_at * 1000).toLocaleDateString()}</span>
            </div>
          </div>
          <button
            onClick={() => handleDelete(s.id)}
            disabled={deleting === s.id}
            className="shrink-0 text-zinc-600 hover:text-red-400 disabled:opacity-40 transition"
            title="Delete"
          >
            {deleting === s.id ? '…' : '✕'}
          </button>
        </div>
      ))}
    </div>
  );
}
