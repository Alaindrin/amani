import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || '';

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable in .env file');
}

export const connectDB = async () => {
  try {
    console.log('Attempting to connect to MongoDB...');
    console.log('MongoDB URI:', MONGODB_URI.replace(/:\/\/([^:]+):([^@]+)@/, '://***:***@'));
    
    const conn = await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    console.log(`📁 Database: ${conn.connection.name}`);
    return conn;
  } catch (error) {
    console.error('❌ Error connecting to MongoDB:', error.message);
    console.error('Full error:', error);
    throw error;
  }
};

export default connectDB;