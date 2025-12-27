# Portfolio Website with MongoDB Atlas

A modern portfolio website built with React, Vite, shadcn/ui, and MongoDB Atlas for backend storage.

## Prerequisites

- Node.js v20 or higher
- MongoDB Atlas account
- npm or yarn package manager

## Setup Instructions

### 1. Clone the repository

```bash
git clone <repository-url>
cd <project-directory>
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Edit `.env` and add your MongoDB connection string:

```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database_name?retryWrites=true&w=majority
PORT=3001
NODE_ENV=development
```

### 4. Database Migration (if migrating from SQLite)

If you have an existing SQLite database (`server/portfolio.db`), you can migrate the data to MongoDB:

```bash
npm run migrate
```

This will:
- Connect to your MongoDB Atlas instance
- Read data from the SQLite database
- Create MongoDB documents for quotations, messages, and admin users
- Skip duplicate entries if the migration is run multiple times

The migration script is idempotent - you can run it multiple times safely.

### 5. Run the Development Server

Start both the frontend and backend servers concurrently:

```bash
npm run dev
```

This will start:
- Frontend server at `http://localhost:8080`
- Backend API server at `http://localhost:3001`

Alternatively, you can run them separately:

```bash
# Frontend only
npm run dev:client

# Backend only
npm run dev:server
```

## Project Structure

```
.
├── server/
│   ├── db/
│   │   └── mongodb.ts          # MongoDB connection setup
│   ├── models/
│   │   ├── Quotation.ts        # Quotation schema
│   │   ├── Message.ts          # Message schema
│   │   └── AdminUser.ts        # Admin user schema
│   ├── index.ts                # Express server with MongoDB
│   ├── migrate-sqlite-to-mongodb.ts  # Migration script
│   └── portfolio.db            # Legacy SQLite database (optional)
├── src/
│   ├── components/
│   ├── lib/
│   │   └── api.ts              # API client
│   └── pages/
├── .env                        # Environment variables (not in git)
├── .env.example                # Example environment variables
└── package.json
```

## API Endpoints

### Quotations
- `POST /api/quotations` - Create a new quotation request
- `GET /api/quotations` - Get all quotations
- `GET /api/quotations/stats` - Get quotation statistics
- `PATCH /api/quotations/:id/status` - Update quotation status
- `DELETE /api/quotations/:id` - Delete a quotation

### Messages
- `POST /api/messages` - Create a new message
- `GET /api/messages` - Get all messages
- `GET /api/messages/stats` - Get message statistics
- `PATCH /api/messages/:id/status` - Update message status
- `DELETE /api/messages/:id` - Delete a message

## MongoDB Schema

### Quotation
```typescript
{
  name: string;
  email: string;
  phone?: string;
  company?: string;
  project_type: string;
  budget?: string;
  timeline?: string;
  description: string;
  status: 'pending' | 'reviewed' | 'responded';
  created_at: Date;
  updated_at: Date;
}
```

### Message
```typescript
{
  name: string;
  email: string;
  message: string;
  status: 'unread' | 'read' | 'replied';
  created_at: Date;
  updated_at: Date;
}
```

### AdminUser
```typescript
{
  username: string;
  password_hash: string;
  created_at: Date;
}
```

## Building for Production

```bash
npm run build
```

The production build will be created in the `dist` directory.

## Technologies Used

- **Frontend**: React, TypeScript, Vite, shadcn/ui, Tailwind CSS
- **Backend**: Express, TypeScript
- **Database**: MongoDB Atlas with Mongoose ODM
- **State Management**: TanStack Query
- **Routing**: React Router v7
- **Icons**: Lucide React

## Migration Notes

The migration script handles:
- ✅ Duplicate detection and skipping
- ✅ Invalid status value mapping (e.g., 'reviewed' → 'responded')
- ✅ Timestamp preservation from SQLite
- ✅ Safe idempotent execution

If you encounter any issues during migration:
1. Check your MongoDB connection string in `.env`
2. Ensure the SQLite database exists at `server/portfolio.db`
3. Review the migration logs for specific errors

## License

[Your License Here]