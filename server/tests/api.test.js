import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import app from '../src/app.js';
import { prisma } from '../src/utils/prisma.js';

let authToken = '';
let testProductId = '';

describe('iGkings Innovation Inventory API Test Suite', () => {
  beforeAll(async () => {
    await prisma.$connect();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('GET /api/health returns healthy status', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('healthy');
    expect(res.body.system).toContain('iGkings Innovation');
  });

  it('POST /api/auth/login rejects invalid credentials', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'wrong@igkings.com', password: 'InvalidPassword' });
    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });

  it('POST /api/auth/login rejects malformed input', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'notanemail', password: '123' });
    expect(res.status).toBe(422);
    expect(res.body.errors).toBeDefined();
  });

  it('POST /api/auth/login succeeds with demo credentials', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'demo@igkings.com', password: 'Demo@12345' });
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.user.email).toBe('demo@igkings.com');
    expect(res.body.data.user.name).toBe('Uchenna');
    expect(res.body.data.token).toBeDefined();
    authToken = res.body.data.token;
  });

  it('GET /api/auth/me returns current user profile with token', async () => {
    const res = await request(app)
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${authToken}`);
    expect(res.status).toBe(200);
    expect(res.body.data.email).toBe('demo@igkings.com');
  });

  it('GET /api/dashboard/stats returns real inventory statistics', async () => {
    const res = await request(app)
      .get('/api/dashboard/stats')
      .set('Authorization', `Bearer ${authToken}`);
    expect(res.status).toBe(200);
    expect(res.body.data.summary).toBeDefined();
    expect(res.body.data.summary.totalProducts).toBeGreaterThan(0);
    expect(res.body.data.summary.totalCategories).toBeGreaterThan(0);
    expect(res.body.data.movementChartData).toBeInstanceOf(Array);
    expect(res.body.data.recentMovements).toBeInstanceOf(Array);
  });

  it('GET /api/products returns products list and pagination', async () => {
    const res = await request(app)
      .get('/api/products')
      .set('Authorization', `Bearer ${authToken}`);
    expect(res.status).toBe(200);
    expect(res.body.data).toBeInstanceOf(Array);
    expect(res.body.meta.total).toBeGreaterThan(0);
    testProductId = res.body.data[0].id;
  });

  it('POST /api/products/:id/adjust performs atomic stock adjustment', async () => {
    const res = await request(app)
      .post(`/api/products/${testProductId}/adjust`)
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        type: 'IN',
        quantity: 5,
        reason: 'Automated Test Restock',
        referenceNote: 'Vitest Test Suite Run',
      });
    expect(res.status).toBe(200);
    expect(res.body.data.product).toBeDefined();
    expect(res.body.data.movement).toBeDefined();
    expect(res.body.data.movement.type).toBe('IN');
  });

  it('GET /api/categories returns categories with product count', async () => {
    const res = await request(app)
      .get('/api/categories')
      .set('Authorization', `Bearer ${authToken}`);
    expect(res.status).toBe(200);
    expect(res.body.data).toBeInstanceOf(Array);
    expect(res.body.data.length).toBeGreaterThan(0);
    expect(res.body.data[0].productCount).toBeDefined();
  });
});
