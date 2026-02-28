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

  if (loading) return <p className="text-gray-400 text-sm">Loading...</p>;
  if (sentences.length === 0) return <p className="text-gray-400 text-sm">No sentences yet.</p>;

  return (
    <div className="space-y-2">
      {sentences.map(s => (
        <div key={s.id} className="bg-white rounded-lg shadow-sm p-4 flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-lg">{s.text}</p>
            <div className="flex items-center gap-3 mt-1 text-xs text-gray-400">
              {s.source_tag && <span className="bg-gray-100 px-2 py-0.5 rounded">{s.source_tag}</span>}
              <span>{new Date(s.created_at * 1000).toLocaleDateString()}</span>
            </div>
          </div>
          <button
            onClick={() => handleDelete(s.id)}
            disabled={deleting === s.id}
            className="shrink-0 text-gray-300 hover:text-red-400 disabled:opacity-40 transition"
            title="Delete"
          >
            {deleting === s.id ? '…' : '✕'}
          </button>
        </div>
      ))}
    </div>
  );
}
