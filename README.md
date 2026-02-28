# 日本語 SRS

A local web app for studying Japanese. Log sentences you encounter, automatically extract vocabulary and kanji, and review them daily using spaced repetition.

## Features

- **Sentence logging** — paste any Japanese sentence; kuromoji tokenizes it and extracts vocab and kanji automatically
- **Spaced repetition** — SM-2 algorithm schedules reading and meaning cards for each word and kanji
- **Jisho lookups** — English definitions and readings fetched from Jisho.org and cached locally
- **Browse** — paginated vocab and kanji lists with per-item detail pages showing SRS status and example sentences
- **Dashboard** — live counts and a one-click link to your due review session

## Stack

| Layer | Tech |
|-------|------|
| Framework | Next.js 14 (App Router) |
| Database | SQLite via better-sqlite3 |
| Tokenizer | kuromoji (Japanese morphological analysis) |
| Dictionary | Jisho.org API |
| Styling | Tailwind CSS + Noto Sans JP |

## Getting Started

```bash
git clone https://github.com/vsshetty89/japanese-srs
cd japanese-srs
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

The SQLite database is created automatically at `data/japanese_srs.db` on first run.

## Usage

1. **Log** → paste a sentence (e.g. `私は毎日日本語を勉強しています。`) and an optional source tag
2. Vocab and kanji are extracted and SRS cards are created immediately
3. **Review** → flashcards show the word; rate yourself 0–5 to schedule the next review
4. **Vocab / Kanji** → browse everything you've seen with SRS intervals and example sentences

## SRS Algorithm

Uses SM-2:

- Quality < 3 → reset to interval 1, repetitions 0
- Rep 0 → 1 day, rep 1 → 6 days, rep 2+ → `round(interval × ease_factor)`
- Ease factor starts at 2.5, minimum 1.3
- Two cards per item: **reading** and **meaning**

## Project Structure

```
app/
  api/          # Route handlers (sentences, vocab, kanji, review, stats)
  log/          # Sentence input page
  review/       # Daily SRS flashcard session
  vocab/        # Browse vocabulary
  kanji/        # Browse kanji
components/     # NavBar, ReviewCard, SentenceInput, etc.
lib/
  db/           # SQLite singleton + schema migrations
  srs/          # SM-2 implementation
  kuromoji/     # Tokenizer singleton
  jisho/        # Jisho API client
  kanji/        # Kanji extraction regex
types/          # Shared TypeScript interfaces
data/           # SQLite DB file (git-ignored)
```
