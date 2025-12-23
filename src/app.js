import express from 'express';
import morgan from 'morgan';
import helmet from 'helmet';
import cors from 'cors';

import env from './config/env.js';
import errorMiddleware from './middlewares/error.middleware.js';
import { apiRateLimiter } from './middlewares/rateLimit.middleware.js';

import authRoutes from './routes/auth.routes.js';
import urlRoutes from './routes/url.routes.js';
import redirectRoutes from './routes/redirect.routes.js';

const app = express();

// Security & logging
app.use(helmet());
app.use(cors());
app.use(morgan(env.NODE_ENV === 'production' ? 'combined' : 'dev'));

// Body parsing
app.use(express.json());

// Health
app.get('/health', (_req, res) => res.json({ status: 'ok' }));

// API routes (rate limited)
app.use('/api', apiRateLimiter);
app.use('/api/auth', authRoutes);
app.use('/api/urls', urlRoutes);

// Redirect route (separate limiter)
app.use('/', redirectRoutes);

// 404
app.use((req, res) => res.status(404).json({ message: 'Not Found' }));

// Error handler
app.use(errorMiddleware);

export default app;
