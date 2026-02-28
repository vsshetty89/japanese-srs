'use client';

import { useState } from 'react';
import SentenceInput from '@/components/SentenceInput';
import SentenceList from '@/components/SentenceList';

export default function LogPage() {
  const [refreshKey, setRefreshKey] = useState(0);

  return (
    <div className="max-w-2xl mx-auto py-8 px-4 space-y-6">
      <h1 className="text-2xl font-bold">Log Sentences</h1>
      <SentenceInput onAdded={() => setRefreshKey(k => k + 1)} />
      <div>
        <h2 className="text-lg font-semibold mb-3">Recent Sentences</h2>
        <SentenceList refreshKey={refreshKey} />
      </div>
    </div>
  );
}
