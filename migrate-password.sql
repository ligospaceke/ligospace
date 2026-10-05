-- Run once on the live database:  npx wrangler d1 execute ligo --remote --file=migrate-password.sql
ALTER TABLE users ADD COLUMN pw TEXT;
ALTER TABLE users ADD COLUMN must_change INTEGER DEFAULT 0;
ALTER TABLE users ADD COLUMN fails INTEGER DEFAULT 0;
ALTER TABLE users ADD COLUMN locked_until INTEGER DEFAULT 0;
DROP TABLE IF EXISTS login_tokens;
