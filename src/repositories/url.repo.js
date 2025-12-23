import Url from '../models/url.model.js';

export function findByShortId(shortId) {
  return Url.findOne({ shortId });
}

export function createUrl(doc) {
  return Url.create(doc);
}

export function findByUserAndUrl(userId, redirectURL) {
  return Url.findOne({ user: userId, redirectURL });
}

export function listByUser(userId) {
  return Url.find({ user: userId }).sort({ createdAt: -1 });
}

export function updateAnalytics(shortId, { timestamp, ip, userAgent }) {
  return Url.updateOne(
    { shortId },
    {
      $inc: { totalClicks: 1 },
      $push: { visitHistory: { timestamp, ip, userAgent } },
    }
  );
}

export async function claimLegacyAlias(shortId, userId) {
  await Url.updateOne(
    { shortId, $or: [{ user: { $exists: false } }, { user: null }] },
    { $set: { user: userId } }
  );
  return Url.findOne({ shortId });
}
