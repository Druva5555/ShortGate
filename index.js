import dotenv from 'dotenv';
import app from './src/app.js';
import { connectDB } from './src/config/db.js';
import env from './src/config/env.js';

dotenv.config();

async function start() {
  if (!env.MONGO_URI) {
    throw new Error('MONGO_URI/MONGO_URL must be set in .env to your MongoDB Atlas connection string');
  }
  await connectDB(env.MONGO_URI);
  app.listen(env.PORT, () => {
    console.log(`Server running on http://localhost:${env.PORT}`);
  });
}

start().catch((err) => {
  console.error('Failed to start server', err);
  process.exit(1);
});
