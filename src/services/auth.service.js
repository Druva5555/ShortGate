import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import env from '../config/env.js';
import { createUser, findUserByEmail } from '../repositories/user.repo.js';

const SALT_ROUNDS = 10;

export async function register({ name, email, password }) {
  const existing = await findUserByEmail(email);
  if (existing) {
    const err = new Error('Email already in use');
    err.status = 409;
    throw err;
  }
  const hash = await bcrypt.hash(password, SALT_ROUNDS);
  const user = await createUser({ name, email, password: hash });
  const token = signToken(user);
  return { user: sanitizeUser(user), token };
}

export async function login({ email, password }) {
  const user = await findUserByEmail(email);
  if (!user) {
    const err = new Error('Invalid credentials');
    err.status = 401;
    throw err;
  }
  const ok = await bcrypt.compare(password, user.password);
  if (!ok) {
    const err = new Error('Invalid credentials');
    err.status = 401;
    throw err;
  }
  const token = signToken(user);
  return { user: sanitizeUser(user), token };
}

function signToken(user) {
  return jwt.sign(
    { sub: user._id.toString(), email: user.email },
    env.JWT_SECRET,
    { expiresIn: env.JWT_EXPIRES_IN }
  );
}

function sanitizeUser(u) {
  return { id: u._id.toString(), name: u.name, email: u.email, createdAt: u.createdAt };
}
