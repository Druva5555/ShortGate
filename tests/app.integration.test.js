import request from 'supertest';
import { MongoMemoryServer } from 'mongodb-memory-server';
import app from '../src/app.js';
import { connectDB, disconnectDB } from '../src/config/db.js';

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

describe('App Integration', () => {
  test('health', async () => {
    const res = await request(app).get('/health');
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('ok');
  });

  test('auth and URL flow', async () => {
    const email = 'u1@example.com';
    const password = 'secret123';

    const reg = await request(app)
      .post('/api/auth/register')
      .send({ name: 'U1', email, password });
    expect(reg.statusCode).toBe(201);
    const token = reg.body.token;

    const create = await request(app)
      .post('/api/urls')
      .set('Authorization', `Bearer ${token}`)
      .send({ url: 'https://example.com/path', alias: 'exmpl1' });
    expect(create.statusCode).toBe(201);
    const { shortId } = create.body;

    // Redirect should be 302
    const redir = await request(app)
      .get(`/${shortId}`)
      .redirects(0);
    expect([301,302]).toContain(redir.statusCode);

    // Analytics should show at least 1 click
    const an = await request(app)
      .get(`/api/urls/${shortId}/analytics`)
      .set('Authorization', `Bearer ${token}`);
    expect(an.statusCode).toBe(200);
    expect(an.body.totalClicks).toBeGreaterThanOrEqual(1);

    const list = await request(app)
      .get('/api/urls')
      .set('Authorization', `Bearer ${token}`);
    expect(list.statusCode).toBe(200);
    expect(Array.isArray(list.body)).toBe(true);
    expect(list.body.some(u => u.shortId === shortId)).toBe(true);
  });
});
