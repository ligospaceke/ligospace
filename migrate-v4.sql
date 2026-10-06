-- Run once on the live database:  npx wrangler d1 execute ligo --remote --file=migrate-v4.sql
CREATE TABLE IF NOT EXISTS settings(k TEXT PRIMARY KEY,v TEXT);
