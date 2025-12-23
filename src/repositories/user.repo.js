import User from '../models/user.model.js';

export async function findUserByEmail(email) {
  return User.findOne({ email });
}

export async function createUser(data) {
  return User.create(data);
}

export async function findUserById(id) {
  return User.findById(id);
}
