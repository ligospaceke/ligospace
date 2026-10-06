-- Run once on the live database:  npx wrangler d1 execute ligo --remote --file=migrate-v5.sql
CREATE TABLE IF NOT EXISTS posts(id INTEGER PRIMARY KEY AUTOINCREMENT,user_id INTEGER NOT NULL,live TEXT,pending TEXT,note TEXT,created TEXT DEFAULT CURRENT_TIMESTAMP,updated TEXT DEFAULT CURRENT_TIMESTAMP);
CREATE INDEX IF NOT EXISTS idx_posts_user ON posts(user_id);
