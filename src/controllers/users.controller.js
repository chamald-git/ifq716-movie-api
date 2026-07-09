import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { HttpError } from '../utils/httpError.js';
import { config } from '../config/env.js';
import { findUserByEmail, insertUser } from '../services/users.service.js';

const BCRYPT_COST = 10;

export async function register(req, res, next) {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) {
      throw new HttpError(400, 'Request body incomplete, both email and password are required');
    }
    const existing = await findUserByEmail(email);
    if (existing) {
      throw new HttpError(409, 'User already exists');
    }
    const hash = await bcrypt.hash(password, BCRYPT_COST);
    await insertUser(email, hash);
    res.status(201).json({ message: 'User created' });
  } catch (err) {
    next(err);
  }
}

export async function login(req, res, next) {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) {
      throw new HttpError(400, 'Request body incomplete, both email and password are required');
    }
    const user = await findUserByEmail(email);
    if (!user) {
      throw new HttpError(401, 'Incorrect email or password');
    }
    const ok = await bcrypt.compare(password, user.hash);
    if (!ok) {
      throw new HttpError(401, 'Incorrect email or password');
    }
    const token = jwt.sign(
      { email: user.email },
      config.jwt.secret,
      { expiresIn: config.jwt.expiresInSeconds }
    );
    res.json({ token, token_type: 'Bearer', expires_in: config.jwt.expiresInSeconds });
  } catch (err) {
    next(err);
  }
}