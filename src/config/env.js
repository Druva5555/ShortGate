import dotenv from 'dotenv';

dotenv.config();

const env = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: parseInt(process.env.PORT || '8000', 10),
  MONGO_URI: process.env.MONGO_URI || process.env.MONGO_URL || null,
  JWT_SECRET: process.env.JWT_SECRET || 'dev_secret_change_me',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
  REDIS_URL: process.env.REDIS_URL || '',
  RATE_LIMIT_WINDOW_MINUTES: parseInt(process.env.RATE_LIMIT_WINDOW_MINUTES || '1', 10),
  RATE_LIMIT_MAX: parseInt(process.env.RATE_LIMIT_MAX || '60', 10),
  BASE_URL: process.env.BASE_URL || `http://localhost:${process.env.PORT || 8000}`,
};

export default env;
