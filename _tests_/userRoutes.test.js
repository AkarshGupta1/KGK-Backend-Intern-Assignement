// Import necessary modules for testing
const request = require('supertest');
const { app } = require('../server'); // Assuming your app is exported from server.js

describe('User Authentication API', () => {
  // Test case for user registration
  describe('POST /users/register', () => {
    it('should register a new user', async () => {
      const res = await request(app)
        .post('/users/register')
        .send({
          username: 'alam',
          password: 'alam1234',
          email: 'fintechamir@gmail.com'
        });
      expect(res.statusCode).toEqual(201);
      expect(res.body).toHaveProperty('username', 'alam');
    });

    it('should return error for invalid registration data', async () => {
      const res = await request(app)
        .post('/users/register')
        .send({
          // Invalid data, missing required fields
        });
      expect(res.statusCode).toEqual(400);
      expect(res.body).toHaveProperty('error');
    });
  });

  // Test case for user login
  describe('POST /users/login', () => {
    it('should login a user with correct credentials', async () => {
      const res = await request(app)
        .post('/users/login')
        .send({
          username: 'alam',
          password: 'alam1234'
        });
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('token');
    });

    it('should return error for invalid login credentials', async () => {
      const res = await request(app)
        .post('/users/login')
        .send({
          username: 'alam',
          password: 'amir1234'
        });
      expect(res.statusCode).toEqual(400);
      expect(res.body).toHaveProperty('error');
    });
  });

  // Test case for getting user profile
  describe('GET /users/profile', () => {
    it('should return user profile when authenticated', async () => {
      // First, login to get the token
      const loginRes = await request(app)
        .post('/users/login')
        .send({
          username: 'alam',
          password: 'alam1234'
        });
      
      // Extract token from login response
      const token = loginRes.body.token;

      // Now make a request to get user profile with the token
      const profileRes = await request(app)
        .get('/users/profile')
        .set('Authorization', `Bearer ${token}`);
      
      expect(profileRes.statusCode).toEqual(200);
      expect(profileRes.body).toHaveProperty('username', 'alam');
    });

    it('should return error when not authenticated', async () => {
      const res = await request(app)
        .get('/users/profile');
      expect(res.statusCode).toEqual(401);
      expect(res.body).toHaveProperty('error');
    });
  });
});
