import Redis from 'ioredis';
import env from './env.js';
import logger from '../utils/logger.js';

let redis = null;

if (env.REDIS_URL) {
  try {
    redis = new Redis(env.REDIS_URL);
    redis.on('connect', () => logger.info('Redis connected'));
    redis.on('error', (err) => logger.error('Redis error', err));
  } catch (err) {
    logger.error('Failed to initialize Redis', err);
  }
}

export default redis;
