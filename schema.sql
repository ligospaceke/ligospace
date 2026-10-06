CREATE TABLE users(id INTEGER PRIMARY KEY AUTOINCREMENT,email TEXT UNIQUE NOT NULL,role TEXT DEFAULT 'member',status TEXT DEFAULT 'active',created TEXT DEFAULT CURRENT_TIMESTAMP,pw TEXT,must_change INTEGER DEFAULT 0,fails INTEGER DEFAULT 0,locked_until INTEGER DEFAULT 0);
CREATE TABLE sessions(hash TEXT PRIMARY KEY,user_id INTEGER,exp INTEGER);
CREATE TABLE profiles(slug TEXT PRIMARY KEY,user_id INTEGER UNIQUE,live TEXT,pending TEXT,hidden INTEGER DEFAULT 0,founder INTEGER DEFAULT 0,note TEXT,updated TEXT DEFAULT CURRENT_TIMESTAMP);
CREATE TABLE media(key TEXT PRIMARY KEY,user_id INTEGER,status TEXT DEFAULT 'pending');
CREATE TABLE submissions(id INTEGER PRIMARY KEY AUTOINCREMENT,type TEXT,payload TEXT,status TEXT DEFAULT 'new',created TEXT DEFAULT CURRENT_TIMESTAMP);
CREATE INDEX idx_sub ON submissions(status,type);
-- After running this file, create the first admin (edit the email), then log in with it:
-- INSERT INTO users(email,role) VALUES('you@example.com','admin');
-- Founder profile (slug must match FOUNDER in js/data/env.js):
-- INSERT INTO profiles(slug,user_id,founder,live) VALUES('samuel-mk',(SELECT id FROM users WHERE email='you@example.com'),1,'{"name":"Samuel M.K.","headline":"Founder & President, L.I.G.O. SPACE","bio":"...","programs":[],"links":{},"photo":"","video":""}');

-- Impact baseline (editable by admins only; verified can never exceed achieved)
CREATE TABLE impact(k TEXT PRIMARY KEY,label TEXT,sort INTEGER,target INTEGER DEFAULT 0,achieved INTEGER DEFAULT 0,verified INTEGER DEFAULT 0,updated TEXT DEFAULT CURRENT_TIMESTAMP);
INSERT INTO impact(k,label,sort) VALUES('reached','People reached',1),('youth','Youth engaged',2),('schools','Schools / institutions engaged',3),('volunteers','Volunteers mobilized',4),('mentors','Mentors / professionals onboarded',5),('sessions','Training sessions delivered',6),('initiatives','Community initiatives conducted',7),('academic','Academic / technical collaborators',8),('partners','Strategic partners',9),('connections','Employment / opportunity connections',10);

-- Chat allowance counters (hashed visitor + daily totals; no message content is stored)
CREATE TABLE chat_rate(k TEXT PRIMARY KEY,n INTEGER,win INTEGER);

-- Admin-chosen settings (the chat model is switched from the Admin page, no redeploy needed)
CREATE TABLE settings(k TEXT PRIMARY KEY,v TEXT);

-- Member posts and products (each goes live only after an admin approves it)
CREATE TABLE posts(id INTEGER PRIMARY KEY AUTOINCREMENT,user_id INTEGER NOT NULL,live TEXT,pending TEXT,note TEXT,created TEXT DEFAULT CURRENT_TIMESTAMP,updated TEXT DEFAULT CURRENT_TIMESTAMP);
CREATE INDEX idx_posts_user ON posts(user_id);
