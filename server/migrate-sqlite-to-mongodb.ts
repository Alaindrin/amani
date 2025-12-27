import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Quotation from './models/Quotation.js';
import Message from './models/Message.js';
import AdminUser from './models/AdminUser.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const MONGODB_URI = process.env.MONGODB_URI || '';

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable in .env file');
}

interface SQLiteQuotation {
  id: number;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  project_type: string;
  budget?: string;
  timeline?: string;
  description: string;
  status: string;
  created_at: string;
  updated_at: string;
}

interface SQLiteMessage {
  id: number;
  name: string;
  email: string;
  message: string;
  status: string;
  created_at: string;
  updated_at: string;
}

interface SQLiteAdminUser {
  id: number;
  username: string;
  password_hash: string;
  created_at: string;
}

const migrate = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Connect to SQLite
    const db = new Database(path.join(__dirname, 'portfolio.db'));
    console.log('Connected to SQLite');

    // Migrate Quotations
    console.log('\n=== Migrating Quotations ===');
    const quotations = db.prepare('SELECT * FROM quotations').all() as SQLiteQuotation[];
    let quotationsMigrated = 0;
    let quotationsSkipped = 0;

    for (const sqliteQuotation of quotations) {
      try {
        // Check if quotation already exists by checking for same email and created_at
        const existingQuotation = await Quotation.findOne({
          email: sqliteQuotation.email,
          created_at: new Date(sqliteQuotation.created_at),
        });

        if (existingQuotation) {
          console.log(`Skipping quotation: ${sqliteQuotation.email} (already exists)`);
          quotationsSkipped++;
          continue;
        }

        // Map invalid status values to valid enum values
        let status = sqliteQuotation.status;
        const validStatuses = ['pending', 'reviewed', 'responded'];
        
        if (!validStatuses.includes(status)) {
          // Map any other status to 'responded'
          console.log(`Mapping invalid status '${status}' to 'responded'`);
          status = 'responded';
        }

        const quotation = new Quotation({
          name: sqliteQuotation.name,
          email: sqliteQuotation.email,
          phone: sqliteQuotation.phone,
          company: sqliteQuotation.company,
          project_type: sqliteQuotation.project_type,
          budget: sqliteQuotation.budget,
          timeline: sqliteQuotation.timeline,
          description: sqliteQuotation.description,
          status: status as 'pending' | 'reviewed' | 'responded',
          created_at: new Date(sqliteQuotation.created_at),
          updated_at: new Date(sqliteQuotation.updated_at),
        });

        await quotation.save();
        quotationsMigrated++;
        console.log(`Migrated quotation: ${sqliteQuotation.email}`);
      } catch (error) {
        console.error(`Error migrating quotation ${sqliteQuotation.id}:`, error);
      }
    }

    console.log(`Quotations: ${quotationsMigrated} migrated, ${quotationsSkipped} skipped`);

    // Migrate Messages
    console.log('\n=== Migrating Messages ===');
    const messages = db.prepare('SELECT * FROM messages').all() as SQLiteMessage[];
    let messagesMigrated = 0;
    let messagesSkipped = 0;

    for (const sqliteMessage of messages) {
      try {
        // Check if message already exists
        const existingMessage = await Message.findOne({
          email: sqliteMessage.email,
          created_at: new Date(sqliteMessage.created_at),
        });

        if (existingMessage) {
          console.log(`Skipping message: ${sqliteMessage.email} (already exists)`);
          messagesSkipped++;
          continue;
        }

        const message = new Message({
          name: sqliteMessage.name,
          email: sqliteMessage.email,
          message: sqliteMessage.message,
          status: sqliteMessage.status as 'unread' | 'read' | 'replied',
          created_at: new Date(sqliteMessage.created_at),
          updated_at: new Date(sqliteMessage.updated_at),
        });

        await message.save();
        messagesMigrated++;
        console.log(`Migrated message: ${sqliteMessage.email}`);
      } catch (error) {
        console.error(`Error migrating message ${sqliteMessage.id}:`, error);
      }
    }

    console.log(`Messages: ${messagesMigrated} migrated, ${messagesSkipped} skipped`);

    // Migrate Admin Users
    console.log('\n=== Migrating Admin Users ===');
    const adminUsers = db.prepare('SELECT * FROM admin_users').all() as SQLiteAdminUser[];
    let adminUsersMigrated = 0;
    let adminUsersSkipped = 0;

    for (const sqliteAdminUser of adminUsers) {
      try {
        // Check if admin user already exists
        const existingAdminUser = await AdminUser.findOne({
          username: sqliteAdminUser.username,
        });

        if (existingAdminUser) {
          console.log(`Skipping admin user: ${sqliteAdminUser.username} (already exists)`);
          adminUsersSkipped++;
          continue;
        }

        const adminUser = new AdminUser({
          username: sqliteAdminUser.username,
          password_hash: sqliteAdminUser.password_hash,
          created_at: new Date(sqliteAdminUser.created_at),
        });

        await adminUser.save();
        adminUsersMigrated++;
        console.log(`Migrated admin user: ${sqliteAdminUser.username}`);
      } catch (error) {
        console.error(`Error migrating admin user ${sqliteAdminUser.id}:`, error);
      }
    }

    console.log(`Admin Users: ${adminUsersMigrated} migrated, ${adminUsersSkipped} skipped`);

    // Close connections
    db.close();
    await mongoose.connection.close();

    console.log('\n=== Migration Summary ===');
    console.log(`Quotations: ${quotationsMigrated} migrated, ${quotationsSkipped} skipped`);
    console.log(`Messages: ${messagesMigrated} migrated, ${messagesSkipped} skipped`);
    console.log(`Admin Users: ${adminUsersMigrated} migrated, ${adminUsersSkipped} skipped`);
    console.log('\nMigration completed successfully!');

    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
};

migrate();