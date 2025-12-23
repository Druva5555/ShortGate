import express from 'express';
import auth from '../middlewares/auth.middleware.js';
import validate from '../middlewares/validate.middleware.js';
import { createUrlSchema } from '../validators/url.schema.js';
import { createUrl, listMyUrls, analytics } from '../controllers/url.controller.js';

const router = express.Router();

router.use(auth);

router.post('/', validate(createUrlSchema), createUrl);
router.get('/', listMyUrls);
router.get('/:shortId/analytics', analytics);

export default router;
