CREATE TABLE IF NOT EXISTS sentences (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  text TEXT NOT NULL,
  source_tag TEXT,
  created_at INTEGER NOT NULL DEFAULT (unixepoch())
);

CREATE TABLE IF NOT EXISTS vocab (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  surface_form TEXT NOT NULL,
  basic_form TEXT NOT NULL,
  reading TEXT NOT NULL,
  pos TEXT NOT NULL,
  jisho_data TEXT,
  UNIQUE(basic_form)
);

CREATE TABLE IF NOT EXISTS kanji (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  character TEXT NOT NULL UNIQUE,
  jisho_data TEXT
);

CREATE TABLE IF NOT EXISTS sentence_vocab (
  sentence_id INTEGER NOT NULL REFERENCES sentences(id) ON DELETE CASCADE,
  vocab_id INTEGER NOT NULL REFERENCES vocab(id) ON DELETE CASCADE,
  PRIMARY KEY (sentence_id, vocab_id)
);

CREATE TABLE IF NOT EXISTS sentence_kanji (
  sentence_id INTEGER NOT NULL REFERENCES sentences(id) ON DELETE CASCADE,
  kanji_id INTEGER NOT NULL REFERENCES kanji(id) ON DELETE CASCADE,
  PRIMARY KEY (sentence_id, kanji_id)
);

CREATE TABLE IF NOT EXISTS srs_cards (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  item_type TEXT NOT NULL CHECK(item_type IN ('vocab', 'kanji')),
  item_id INTEGER NOT NULL,
  card_type TEXT NOT NULL CHECK(card_type IN ('reading', 'meaning')),
  repetitions INTEGER NOT NULL DEFAULT 0,
  ease_factor REAL NOT NULL DEFAULT 2.5,
  interval INTEGER NOT NULL DEFAULT 1,
  due_date INTEGER NOT NULL DEFAULT (unixepoch()),
  UNIQUE(item_type, item_id, card_type)
);

CREATE TABLE IF NOT EXISTS review_log (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  card_id INTEGER NOT NULL REFERENCES srs_cards(id) ON DELETE CASCADE,
  quality INTEGER NOT NULL,
  reviewed_at INTEGER NOT NULL DEFAULT (unixepoch())
);
