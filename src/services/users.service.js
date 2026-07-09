import { db } from '../config/db.js';

export function findUserByEmail(email) {
  return db('users').where({ email }).first();
}

export function insertUser(email, hash) {
  return db('users').insert({ email, hash });
}