import { MongoMemoryServer } from 'mongodb-memory-server';
import { connectDB, disconnectDB } from '../src/config/db.js';
import * as authService from '../src/services/auth.service.js';

let mongod;

beforeAll(async () => {
  mongod = await MongoMemoryServer.create();
  const uri = mongod.getUri();
  await connectDB(uri);
});

afterAll(async () => {
  await disconnectDB();
  await mongod.stop();
});

describe('Auth Service', () => {
  test('register and login', async () => {
    const email = 'test@example.com';
    const password = 'password123';

    const reg = await authService.register({ name: 'Test', email, password });
    expect(reg.user.email).toBe(email);
    expect(reg.token).toBeDefined();

    await expect(authService.register({ name: 'Dup', email, password }))
      .rejects.toHaveProperty('status', 409);

    const logged = await authService.login({ email, password });
    expect(logged.user.email).toBe(email);
    expect(logged.token).toBeDefined();

    await expect(authService.login({ email, password: 'wrong' }))
      .rejects.toHaveProperty('status', 401);
  });
});
