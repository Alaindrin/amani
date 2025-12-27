import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = new Database(path.join(__dirname, 'portfolio.db'));

// Enable foreign keys
db.pragma('foreign_keys = ON');

// Initialize database schema immediately
const initDatabase = () => {
  // Create quotations table
  db.exec(`
    CREATE TABLE IF NOT EXISTS quotations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT,
      company TEXT,
      project_type TEXT NOT NULL,
      budget TEXT,
      timeline TEXT,
      description TEXT NOT NULL,
      status TEXT DEFAULT 'pending',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Create messages table
  db.exec(`
    CREATE TABLE IF NOT EXISTS messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      message TEXT NOT NULL,
      status TEXT DEFAULT 'unread',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Create admin users table (for future authentication)
  db.exec(`
    CREATE TABLE IF NOT EXISTS admin_users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  console.log('Database initialized successfully');
};

// Initialize database on module load
initDatabase();

export { initDatabase };

// Quotation queries
export const quotationQueries = {
  create: db.prepare(`
    INSERT INTO quotations (name, email, phone, company, project_type, budget, timeline, description)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `),
  
  getAll: db.prepare(`
    SELECT * FROM quotations ORDER BY created_at DESC
  `),
  
  getById: db.prepare(`
    SELECT * FROM quotations WHERE id = ?
  `),
  
  updateStatus: db.prepare(`
    UPDATE quotations SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?
  `),
  
  delete: db.prepare(`
    DELETE FROM quotations WHERE id = ?
  `),
  
  getStats: db.prepare(`
    SELECT 
      COUNT(*) as total,
      SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending,
      SUM(CASE WHEN status = 'reviewed' THEN 1 ELSE 0 END) as reviewed,
      SUM(CASE WHEN status = 'responded' THEN 1 ELSE 0 END) as responded
    FROM quotations
  `)
};

// Message queries
export const messageQueries = {
  create: db.prepare(`
    INSERT INTO messages (name, email, message)
    VALUES (?, ?, ?)
  `),
  
  getAll: db.prepare(`
    SELECT * FROM messages ORDER BY created_at DESC
  `),
  
  getById: db.prepare(`
    SELECT * FROM messages WHERE id = ?
  `),
  
  updateStatus: db.prepare(`
    UPDATE messages SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?
  `),
  
  delete: db.prepare(`
    DELETE FROM messages WHERE id = ?
  `),
  
  getStats: db.prepare(`
    SELECT 
      COUNT(*) as total,
      SUM(CASE WHEN status = 'unread' THEN 1 ELSE 0 END) as unread,
      SUM(CASE WHEN status = 'read' THEN 1 ELSE 0 END) as read,
      SUM(CASE WHEN status = 'replied' THEN 1 ELSE 0 END) as replied
    FROM messages
  `)
};

export default db;