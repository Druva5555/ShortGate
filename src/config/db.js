import mongoose from 'mongoose';
import env from './env.js';

export async function connectDB(uri = env.MONGO_URI) {
  mongoose.set('strictQuery', true);
  try {
    await mongoose.connect(uri);
    if (env.NODE_ENV !== 'test') {
      console.log('MongoDB connected');
    }
  } catch (err) {
    console.error('MongoDB connection error', err);
    throw err;
  }
}

export async function disconnectDB() {
  await mongoose.disconnect();
}

export default connectDB;
