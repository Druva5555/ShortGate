import express from 'express';
import validate from '../middlewares/validate.middleware.js';
import { loginSchema, registerSchema } from '../validators/auth.schema.js';
import { register, login } from '../controllers/auth.controller.js';

const router = express.Router();

router.post('/register', validate(registerSchema), register);
router.post('/login', validate(loginSchema), login);

export default router;
