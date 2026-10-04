CREATE TABLE users(id INTEGER PRIMARY KEY AUTOINCREMENT,email TEXT UNIQUE NOT NULL,role TEXT DEFAULT 'member',status TEXT DEFAULT 'active',created TEXT DEFAULT CURRENT_TIMESTAMP);
CREATE TABLE login_tokens(hash TEXT PRIMARY KEY,user_id INTEGER,exp INTEGER);
CREATE TABLE sessions(hash TEXT PRIMARY KEY,user_id INTEGER,exp INTEGER);
CREATE TABLE profiles(slug TEXT PRIMARY KEY,user_id INTEGER UNIQUE,live TEXT,pending TEXT,hidden INTEGER DEFAULT 0,founder INTEGER DEFAULT 0,note TEXT,updated TEXT DEFAULT CURRENT_TIMESTAMP);
CREATE TABLE media(key TEXT PRIMARY KEY,user_id INTEGER,status TEXT DEFAULT 'pending');
CREATE TABLE submissions(id INTEGER PRIMARY KEY AUTOINCREMENT,type TEXT,payload TEXT,status TEXT DEFAULT 'new',created TEXT DEFAULT CURRENT_TIMESTAMP);
CREATE INDEX idx_sub ON submissions(status,type);
-- After running this file, create the first admin (edit the email), then log in with it:
-- INSERT INTO users(email,role) VALUES('you@example.com','admin');
-- Founder profile (slug must match FOUNDER in js/data/env.js):
-- INSERT INTO profiles(slug,user_id,founder,live) VALUES('samuel-mk',(SELECT id FROM users WHERE email='you@example.com'),1,'{"name":"Samuel M.K.","headline":"Founder & President, L.I.G.O. SPACE","bio":"...","programs":[],"links":{},"photo":"","video":""}');
