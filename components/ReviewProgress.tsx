interface Props {
  done: number;
  total: number;
}

export default function ReviewProgress({ done, total }: Props) {
  const pct = total > 0 ? Math.round((done / total) * 100) : 0;

  return (
    <div className="mb-4">
      <div className="flex justify-between text-sm text-zinc-500 mb-1">
        <span>{done} / {total} reviewed</span>
        <span>{pct}%</span>
      </div>
      <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden">
        <div
          className="h-full bg-violet-500 transition-all duration-300"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
