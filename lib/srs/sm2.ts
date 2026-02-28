import type { SRSCard } from '@/types';

const SECONDS_PER_DAY = 86400;

export function sm2(card: SRSCard, quality: number): SRSCard {
  let { repetitions, ease_factor, interval } = card;

  if (quality < 3) {
    repetitions = 0;
    interval = 1;
  } else {
    if (repetitions === 0) {
      interval = 1;
    } else if (repetitions === 1) {
      interval = 6;
    } else {
      interval = Math.round(interval * ease_factor);
    }
    repetitions += 1;
  }

  ease_factor = ease_factor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
  if (ease_factor < 1.3) ease_factor = 1.3;

  const due_date = Math.floor(Date.now() / 1000) + interval * SECONDS_PER_DAY;

  return { ...card, repetitions, ease_factor, interval, due_date };
}
