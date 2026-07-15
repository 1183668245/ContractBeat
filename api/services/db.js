import fs from "fs";
import path from "path";
import Database from "better-sqlite3";
import { env } from "../utils/env.js";

const dbFile = path.resolve(process.cwd(), env.sqlitePath);
fs.mkdirSync(path.dirname(dbFile), { recursive: true });

export const db = new Database(dbFile);

db.pragma("journal_mode = WAL");

db.exec(`
  CREATE TABLE IF NOT EXISTS projects (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    chain TEXT NOT NULL,
    address TEXT NOT NULL,
    name TEXT NOT NULL,
    symbol TEXT NOT NULL,
    logo TEXT,
    website TEXT,
    twitter TEXT,
    telegram TEXT,
    price TEXT,
    market_cap TEXT,
    liquidity TEXT,
    volume_24h TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
  );

  CREATE UNIQUE INDEX IF NOT EXISTS idx_projects_chain_address ON projects(chain, address);

  CREATE TABLE IF NOT EXISTS generations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    wallet_address TEXT,
    project_name TEXT NOT NULL,
    chain TEXT NOT NULL,
    address TEXT NOT NULL,
    song_title TEXT NOT NULL,
    subtitle TEXT,
    lyrics TEXT NOT NULL,
    prompt_text TEXT NOT NULL,
    music_tags TEXT,
    cover_image TEXT,
    poster_image TEXT,
    music_task_id TEXT,
    music_status TEXT,
    music_audio_url TEXT,
    music_provider TEXT,
    cover_task_id TEXT,
    cover_status TEXT,
    cover_image_url TEXT,
    poster_task_id TEXT,
    poster_status TEXT,
    poster_image_url TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
  );
`);

function ensureColumn(table, column, ddl) {
  const columns = db.prepare(`PRAGMA table_info(${table})`).all();
  if (!columns.some((item) => item.name === column)) {
    db.exec(`ALTER TABLE ${table} ADD COLUMN ${ddl}`);
  }
}

ensureColumn("generations", "wallet_address", "wallet_address TEXT");
ensureColumn("generations", "subtitle", "subtitle TEXT");
ensureColumn("generations", "music_tags", "music_tags TEXT");
ensureColumn("generations", "music_task_id", "music_task_id TEXT");
ensureColumn("generations", "music_status", "music_status TEXT");
ensureColumn("generations", "music_audio_url", "music_audio_url TEXT");
ensureColumn("generations", "music_provider", "music_provider TEXT");
ensureColumn("generations", "cover_task_id", "cover_task_id TEXT");
ensureColumn("generations", "cover_status", "cover_status TEXT");
ensureColumn("generations", "cover_image_url", "cover_image_url TEXT");
ensureColumn("generations", "poster_task_id", "poster_task_id TEXT");
ensureColumn("generations", "poster_status", "poster_status TEXT");
ensureColumn("generations", "poster_image_url", "poster_image_url TEXT");

const projectCount = db.prepare("SELECT COUNT(*) AS count FROM projects").get().count;

if (projectCount === 0) {
  const insert = db.prepare(`
    INSERT INTO projects (
      chain, address, name, symbol, logo, website, twitter, telegram,
      price, market_cap, liquidity, volume_24h
    ) VALUES (
      @chain, @address, @name, @symbol, @logo, @website, @twitter, @telegram,
      @price, @market_cap, @liquidity, @volume_24h
    )
  `);

  insert.run({
    chain: "bsc",
    address: "0xc748673057861a797275cd8a068abb95a902e8de",
    name: "Robin",
    symbol: "ROBIN",
    logo: "/assets/covers/hero-cover-robin.webp",
    website: "https://example.com",
    twitter: "https://x.com/example",
    telegram: "https://t.me/example",
    price: "$0.0042",
    market_cap: "$4.8M",
    liquidity: "$1.1M",
    volume_24h: "$780K"
  });
}