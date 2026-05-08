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

// Ensure `primary_cpr` column exists (for existing DBs)
try {
  const cols = db.prepare("PRAGMA table_info(leads)").all();
  const hasPrimaryCpr = cols.some(c => c.name === 'primary_cpr');
  const hasCoApplicantCpr = cols.some(c => c.name === 'co_applicant_cpr');
  if (!hasPrimaryCpr) {
    db.exec("ALTER TABLE leads ADD COLUMN primary_cpr TEXT");
  }
  if (!hasCoApplicantCpr) {
    db.exec("ALTER TABLE leads ADD COLUMN co_applicant_cpr TEXT");
  }
} catch (err) {
  // ignore if table doesn't exist yet or other issues
}

module.exports = db;