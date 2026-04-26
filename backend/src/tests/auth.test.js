const request = require('supertest');
const app = require('../index');

describe('Auth API Tests', () => {
  
  test('POST /api/auth/register - should register a new user', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Test Patient',
        email: `testpatient${Date.now()}@test.com`,
        password: 'test123456',
        role: 'patient'
      });
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('token');
    expect(res.body.user.role).toBe('patient');
  });

  test('POST /api/auth/login - should login successfully', async () => {
    const email = `testlogin${Date.now()}@test.com`;
    await request(app)
      .post('/api/auth/register')
      .send({ name: 'Test', email, password: 'test123456', role: 'patient' });

    const res = await request(app)
      .post('/api/auth/login')
      .send({ email, password: 'test123456' });
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('token');
  });

  test('POST /api/auth/login - should fail with wrong password', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'mia@gmail.com', password: 'wrongpassword' });
    expect(res.statusCode).toBe(400);
  });

  test('GET /api/patients/profile - should fail without token', async () => {
    const res = await request(app)
      .get('/api/patients/profile');
    expect(res.statusCode).toBe(401);
  });

  test('GET / - should return API running message', async () => {
    const res = await request(app).get('/');
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('Hospital Management System API is running');
  });

});