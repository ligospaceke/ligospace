-- Run once on the live database:  npx wrangler d1 execute ligo --remote --file=migrate-v3.sql
CREATE TABLE IF NOT EXISTS chat_rate(k TEXT PRIMARY KEY,n INTEGER,win INTEGER);
-- The founder's phone appears ONLY on the founder page. Change the number here any time.
UPDATE profiles SET live=json_set(live,'$.phone','+254 791 236 179') WHERE founder=1;
