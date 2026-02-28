import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

const DB_PATH = path.join(process.cwd(), 'data', 'japanese_srs.db');

declare global {
  // eslint-disable-next-line no-var
  var __db: Database.Database | undefined;
}

function initDB(): Database.Database {
  const dataDir = path.dirname(DB_PATH);
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  const db = new Database(DB_PATH);
  db.pragma('journal_mode = WAL');
  db.pragma('foreign_keys = ON');

  const schema = fs.readFileSync(
    path.join(process.cwd(), 'lib', 'db', 'schema.sql'),
    'utf-8'
  );
  db.exec(schema);

  return db;
}

export function getDB(): Database.Database {
  if (!globalThis.__db) {
    globalThis.__db = initDB();
  }
  return globalThis.__db;
}
