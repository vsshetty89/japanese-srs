'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const links = [
  { href: '/', label: 'Dashboard' },
  { href: '/log', label: 'Log' },
  { href: '/review', label: 'Review' },
  { href: '/vocab', label: 'Vocab' },
  { href: '/kanji', label: 'Kanji' },
];

export default function NavBar() {
  const pathname = usePathname();

  return (
    <nav className="bg-zinc-900 border-b border-zinc-800 sticky top-0 z-10">
      <div className="max-w-2xl mx-auto px-4 flex items-center h-14 gap-1">
        <Link href="/" className="font-bold text-violet-400 mr-4 shrink-0 tracking-wide">烏 Karasu</Link>
        {links.map(l => (
          <Link
            key={l.href}
            href={l.href}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${
              pathname === l.href
                ? 'bg-violet-900/50 text-violet-300'
                : 'text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100'
            }`}
          >
            {l.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}
