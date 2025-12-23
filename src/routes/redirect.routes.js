import express from 'express';
import { redirectRateLimiter } from '../middlewares/rateLimit.middleware.js';
import * as urlService from '../services/url.service.js';

const router = express.Router();

// Validate shortId inside handler to avoid path-to-regexp issues in Express 5
router.get('/:shortId', redirectRateLimiter, async (req, res) => {
  const { shortId } = req.params;
  if (!/^[a-zA-Z0-9_-]{4,64}$/.test(shortId)) {
    return res.status(404).send('Short URL not found');
  }
  try {
    const result = await urlService.getRedirectTarget(shortId);
    if (!result) {
      return res.status(404).send('Short URL not found');
    }
    if (result.expired) {
      return res.status(410).send('Short URL expired');
    }

    // Fire-and-forget analytics (should not slow down redirect)
    res.redirect(302, result.redirectURL);
    urlService
      .recordClick(shortId, { ip: req.ip, userAgent: req.headers['user-agent'] || '' })
      .catch(() => {});
  } catch (err) {
    res.status(500).send('Server error');
  }
});

export default router;
