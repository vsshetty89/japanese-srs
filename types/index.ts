export interface Sentence {
  id: number;
  text: string;
  source_tag: string | null;
  created_at: number;
}

export interface Vocab {
  id: number;
  surface_form: string;
  basic_form: string;
  reading: string;
  pos: string;
  jisho_data: string | null;
}

export interface Kanji {
  id: number;
  character: string;
  jisho_data: string | null;
}

export interface SRSCard {
  id: number;
  item_type: 'vocab' | 'kanji';
  item_id: number;
  card_type: 'reading' | 'meaning';
  repetitions: number;
  ease_factor: number;
  interval: number;
  due_date: number;
}

export interface ReviewLog {
  card_id: number;
  quality: number;
  reviewed_at: number;
}
