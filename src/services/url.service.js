import { nanoid } from 'nanoid';
import redis from '../config/redis.js';
import env from '../config/env.js';
import {
  findByShortId,
  createUrl,
  findByUserAndUrl,
  listByUser,
  updateAnalytics,
  claimLegacyAlias,
} from '../repositories/url.repo.js';
import { isValidHttpUrl, normalizeUrl } from '../utils/url.js';

const CACHE_TTL_SECONDS = 3600;

export async function createShortUrl({ url, alias, expiresInDays }, userId) {
  const normalized = normalizeUrl(url);
  if (!isValidHttpUrl(normalized)) {
    const err = new Error('Invalid URL');
    err.status = 400;
    throw err;
  }

  // First, if the user already has this URL, return the existing doc (prevent duplicates)
  const existingByUserAndUrl = await findByUserAndUrl(userId, normalized);
  if (existingByUserAndUrl) {
    return existingByUserAndUrl;
  }

  if (alias) {
    if (!/^[a-zA-Z0-9_-]{4,30}$/.test(alias)) {
      const err = new Error('Invalid custom alias');
      err.status = 400;
      throw err;
    }
    const existingAlias = await findByShortId(alias);
    if (existingAlias) {
      // If alias belongs to same user and same target, return existing to be idempotent
      if (
        existingAlias.user &&
        userId &&
        existingAlias.user.toString() === userId &&
        existingAlias.redirectURL === normalized
      ) {
        return existingAlias;
      }
      // If alias is a legacy record (no user) and targets same URL, claim it for this user
      if (!existingAlias.user && existingAlias.redirectURL === normalized) {
        const claimed = await claimLegacyAlias(alias, userId);
        return claimed || existingAlias;
      }
      const err = new Error(
        existingAlias.user && userId && existingAlias.user.toString() === userId
          ? 'Alias already used by you for a different URL'
          : 'Alias already taken'
      );
      err.status = 409;
      throw err;
    }
  }

  const shortId = alias || nanoid(8);
  const doc = {
    shortId,
    redirectURL: normalized,
    user: userId,
  };

  if (expiresInDays && Number.isFinite(expiresInDays) && expiresInDays > 0) {
    doc.expiresAt = new Date(Date.now() + expiresInDays * 24 * 60 * 60 * 1000);
  }

  const created = await createUrl(doc);
  return created;
}

export async function listUserUrls(userId) {
  const list = await listByUser(userId);
  return list;
}

export async function getUrlAnalytics(shortId, userId) {
  const url = await findByShortId(shortId);
  if (!url) {
    const err = new Error('Not found');
    err.status = 404;
    throw err;
  }
  // Allow analytics if owned by the requester, or if legacy record without user
  if (url.user && url.user.toString() !== userId) {
    const err = new Error('Not found');
    err.status = 404;
    throw err;
  }
  return {
    shortId: url.shortId,
    totalClicks: url.totalClicks,
    visitHistory: url.visitHistory,
  };
}

export async function getRedirectTarget(shortId) {
  if (redis && redis.status === 'ready') {
    const cached = await redis.get(`url:${shortId}`);
    if (cached) {
      return { redirectURL: cached };
    }
  }
  const url = await findByShortId(shortId);
  if (!url) return null;
  if (url.expiresAt && url.expiresAt.getTime() <= Date.now()) {
    return { expired: true };
  }
  if (redis && redis.status === 'ready') {
    await redis.setex(`url:${shortId}`, CACHE_TTL_SECONDS, url.redirectURL);
  }
  return { redirectURL: url.redirectURL };
}

export function recordClick(shortId, { ip, userAgent }) {
  return updateAnalytics(shortId, { timestamp: new Date(), ip, userAgent });
}
