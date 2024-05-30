const request = require('supertest');
const { app } = require('../server');
const { sequelize } = require('../config/database');
const Item = require('../models/Item');

// Create a test item object for use in tests
const testItem = {
  name: 'Test Item',
  description: 'This is a test item',
  starting_price: 10,
  end_time: new Date().toISOString()
};

beforeAll(async () => {
  // Ensure the database is synchronized before running tests
  await sequelize.sync();
});

afterAll(async () => {
  // Clean up the database after running tests
  await sequelize.close();
});

describe('Item Routes', () => {
  describe('GET /items', () => {
    it('should return a list of items', async () => {
      const res = await request(app).get('/items');
      expect(res.statusCode).toEqual(200);
      expect(Array.isArray(res.body.items)).toBe(true);
    });
  });

  describe('GET /items/:id', () => {
    it('should return a single item', async () => {
      // Create a test item in the database
      const newItem = await Item.create(testItem);
      
      const res = await request(app).get(`/items/${newItem.id}`);
      expect(res.statusCode).toEqual(200);
      expect(res.body.name).toEqual(testItem.name);
    });

    it('should return 404 if item not found', async () => {
      const res = await request(app).get('/items/999');
      expect(res.statusCode).toEqual(404);
    });
  });

  describe('POST /items', () => {
    it('should create a new item', async () => {
      const res = await request(app)
        .post('/items')
        .send(testItem);
      expect(res.statusCode).toEqual(201);
      expect(res.body.name).toEqual(testItem.name);
    });
  });

  describe('PUT /items/:id', () => {
    it('should update an existing item', async () => {
      // Create a test item in the database
      const newItem = await Item.create(testItem);
      const updatedItemData = {
        name: 'Updated Test Item',
        description: 'This is an updated test item',
        starting_price: 20,
        end_time: new Date().toISOString()
      };
      
      const res = await request(app)
        .put(`/items/${newItem.id}`)
        .send(updatedItemData);
      
      expect(res.statusCode).toEqual(200);
      expect(res.body.name).toEqual(updatedItemData.name);
      expect(res.body.description).toEqual(updatedItemData.description);
      expect(res.body.starting_price).toEqual(updatedItemData.starting_price);
      expect(res.body.end_time).toEqual(updatedItemData.end_time);
    });

    it('should return 404 if item not found', async () => {
      const res = await request(app)
        .put('/items/999')
        .send({ name: 'Updated Test Item' });
      expect(res.statusCode).toEqual(404);
    });
  });

  describe('DELETE /items/:id', () => {
    it('should delete an existing item', async () => {
      // Create a test item in the database
      const newItem = await Item.create(testItem);
      
      const res = await request(app).delete(`/items/${newItem.id}`);
      expect(res.statusCode).toEqual(200);
      expect(res.body.message).toEqual('Item deleted');
      
      // Ensure item is deleted from the database
      const deletedItem = await Item.findByPk(newItem.id);
      expect(deletedItem).toBeNull();
    });

    it('should return 404 if item not found', async () => {
      const res = await request(app).delete('/items/999');
      expect(res.statusCode).toEqual(404);
    });
  });
});
