'use client';

import { useState } from 'react';

interface Props {
  onAdded: () => void;
}

export default function SentenceInput({ onAdded }: Props) {
  const [text, setText] = useState('');
  const [sourceTag, setSourceTag] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ vocab_count: number; kanji_count: number } | null>(null);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!text.trim()) return;
    setLoading(true);
    setError('');
    setResult(null);

    try {
      const res = await fetch('/api/sentences', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: text.trim(), source_tag: sourceTag.trim() || undefined }),
      });
      if (!res.ok) throw new Error('Failed to add sentence');
      const data = await res.json();
      setResult({ vocab_count: data.vocab_count, kanji_count: data.kanji_count });
      setText('');
      setSourceTag('');
      onAdded();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-white rounded-xl shadow p-6">
      <h2 className="text-lg font-semibold mb-4">Add Sentence</h2>
      <form onSubmit={handleSubmit} className="space-y-3">
        <textarea
          className="w-full border border-gray-200 rounded-lg p-3 text-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 resize-none"
          rows={3}
          placeholder="日本語の文章を入力してください..."
          value={text}
          onChange={e => setText(e.target.value)}
          disabled={loading}
        />
        <input
          type="text"
          className="w-full border border-gray-200 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
          placeholder="Source tag (e.g. book, anime) — optional"
          value={sourceTag}
          onChange={e => setSourceTag(e.target.value)}
          disabled={loading}
        />
        <button
          type="submit"
          disabled={loading || !text.trim()}
          className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 text-white font-medium py-2 rounded-lg transition"
        >
          {loading ? 'Analyzing...' : 'Add Sentence'}
        </button>
      </form>
      {result && (
        <p className="mt-3 text-sm text-green-600">
          Added! Extracted {result.vocab_count} vocab tokens and {result.kanji_count} kanji.
        </p>
      )}
      {error && <p className="mt-3 text-sm text-red-500">{error}</p>}
    </div>
  );
}
