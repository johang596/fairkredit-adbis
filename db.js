const Database = require('better-sqlite3');
const db = new Database('fairkredit.db');

db.exec(`
  CREATE TABLE IF NOT EXISTS leads (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    primary_name TEXT NOT NULL,
    primary_phone TEXT NOT NULL,
    primary_email TEXT NOT NULL,
    property TEXT NOT NULL,
    notes TEXT,
    has_co_applicant INTEGER DEFAULT 0,
    co_applicant_name TEXT,
    co_applicant_phone TEXT,
    co_applicant_email TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

module.exports = db;