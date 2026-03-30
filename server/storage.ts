import Database from "better-sqlite3";
import path from "path";

const DB_PATH = path.join(process.cwd(), "data", "algo-visualizer.db");

let _db: Database.Database | null = null;

function getDb(): Database.Database {
  if (!_db) {
    // Ensure data directory exists
    const dir = path.dirname(DB_PATH);
    const fs = require("fs");
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    _db = new Database(DB_PATH);
    _db.pragma("journal_mode = WAL");
    _db.pragma("foreign_keys = ON");

    // Create table if not exists
    _db.exec(`
      CREATE TABLE IF NOT EXISTS saved_codes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        code TEXT NOT NULL,
        algorithm_type TEXT,
        created_at TEXT NOT NULL DEFAULT (datetime('now')),
        updated_at TEXT NOT NULL DEFAULT (datetime('now'))
      )
    `);
  }
  return _db;
}

export interface SavedCode {
  id: number;
  title: string;
  code: string;
  algorithm_type: string | null;
  created_at: string;
  updated_at: string;
}

export function listSavedCodes(): SavedCode[] {
  return getDb()
    .prepare("SELECT * FROM saved_codes ORDER BY updated_at DESC")
    .all() as SavedCode[];
}

export function getSavedCode(id: number): SavedCode | undefined {
  return getDb().prepare("SELECT * FROM saved_codes WHERE id = ?").get(id) as
    | SavedCode
    | undefined;
}

export function createSavedCode(
  title: string,
  code: string,
  algorithmType?: string,
): SavedCode {
  const stmt = getDb().prepare(
    "INSERT INTO saved_codes (title, code, algorithm_type) VALUES (?, ?, ?)",
  );
  const result = stmt.run(title, code, algorithmType ?? null);
  return getSavedCode(result.lastInsertRowid as number)!;
}

export function updateSavedCode(
  id: number,
  title: string,
  code: string,
  algorithmType?: string,
): SavedCode | undefined {
  getDb()
    .prepare(
      "UPDATE saved_codes SET title = ?, code = ?, algorithm_type = ?, updated_at = datetime('now') WHERE id = ?",
    )
    .run(title, code, algorithmType ?? null, id);
  return getSavedCode(id);
}

export function deleteSavedCode(id: number): boolean {
  const result = getDb()
    .prepare("DELETE FROM saved_codes WHERE id = ?")
    .run(id);
  return result.changes > 0;
}
