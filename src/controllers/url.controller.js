import asyncHandler from '../utils/asyncHandler.js';
import * as urlService from '../services/url.service.js';
import env from '../config/env.js';

export const createUrl = asyncHandler(async (req, res) => {
  const { url, alias, expiresInDays } = req.body;
  const userId = req.user.id;
  const created = await urlService.createShortUrl({ url, alias, expiresInDays }, userId);
  res.status(201).json({
    shortId: created.shortId,
    shortUrl: `${env.BASE_URL}/${created.shortId}`,
    redirectURL: created.redirectURL,
    expiresAt: created.expiresAt,
  });
});

export const listMyUrls = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const list = await urlService.listUserUrls(userId);
  res.json(
    list.map((u) => ({
      shortId: u.shortId,
      shortUrl: `${env.BASE_URL}/${u.shortId}`,
      redirectURL: u.redirectURL,
      totalClicks: u.totalClicks,
      createdAt: u.createdAt,
      expiresAt: u.expiresAt,
    }))
  );
});

export const analytics = asyncHandler(async (req, res) => {
  const { shortId } = req.params;
  const userId = req.user.id;
  const data = await urlService.getUrlAnalytics(shortId, userId);
  res.json(data);
});
