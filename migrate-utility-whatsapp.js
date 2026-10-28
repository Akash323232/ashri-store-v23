require('dotenv').config();
const fs = require('node:fs');
const path = require('node:path');
const { Pool } = require('pg');
if (!process.env.DATABASE_URL) { console.error('Set DATABASE_URL in .env'); process.exit(1); }
const pool = new Pool({ connectionString: process.env.DATABASE_URL, ssl: process.env.PGSSL === 'true' ? { rejectUnauthorized: true } : undefined });
(async () => { try { await pool.query(fs.readFileSync(path.join(__dirname, 'migrate-utility-whatsapp.sql'), 'utf8')); console.log('WhatsApp opt-in migration complete.'); } catch (e) { console.error(e.message); process.exitCode = 1; } finally { await pool.end(); } })();
