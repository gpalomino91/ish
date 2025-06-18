
const request = require('supertest');
const app = require('../server'); // Use the actual app exported from server.js

describe('Product API Endpoints', () => {
  // Note: For a truly isolated test suite, you'd reset the state of 'products'
  // and 'nextProductId' in server.js before each test or group of tests.
  // This can be done by exporting a reset function from server.js or by re-requiring the module.
  // For this example, tests might depend on the order or previous state modifications.

  it('GET /api/products - should return all products initially', async () => {
    const response = await request(app).get('/api/products');
    expect(response.statusCode).toBe(200);
    // Initial state from server.js has 3 products
    expect(response.body.length).toBe(3);
    expect(response.body[0]).toHaveProperty('id');
    expect(response.body[0]).toHaveProperty('name', 'Smart Bulb');
  });

  it('POST /api/products - should create a new product', async () => {
    const newProductData = { name: 'Test Product', description: 'A new test product', price: 100, imageUrl: 'test.png' };
    const response = await request(app)
      .post('/api/products')
      .send(newProductData);
    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty('id');
    expect(response.body.name).toBe(newProductData.name);
    expect(response.body.id).toBe(4); // nextProductId was 4

    // Verify product was added (now 4 products)
    const getResponse = await request(app).get('/api/products');
    expect(getResponse.body.length).toBe(4);
    expect(getResponse.body.some(p => p.name === newProductData.name)).toBe(true);
  });

   it('POST /api/products - should return 400 for missing fields', async () => {
    const incompleteProduct = { name: 'Test Product Only Name' }; // Missing description and price
    const response = await request(app)
      .post('/api/products')
      .send(incompleteProduct);
    expect(response.statusCode).toBe(400);
    expect(response.text).toBe('Missing required fields: name, description, price');
  });

  it('GET /api/products/:id - should return a specific product', async () => {
    const response = await request(app).get('/api/products/1');
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('id', 1);
    expect(response.body.name).toBe('Smart Bulb');
  });

  it('GET /api/products/:id - should return 404 for non-existent product', async () => {
    const response = await request(app).get('/api/products/999');
    expect(response.statusCode).toBe(404);
  });

  it('PUT /api/products/:id - should update an existing product', async () => {
    const updatedData = { name: 'Updated Smart Bulb', price: 22 };
    const response = await request(app)
      .put('/api/products/1')
      .send(updatedData);
    expect(response.statusCode).toBe(200);
    expect(response.body.name).toBe('Updated Smart Bulb');
    expect(response.body.price).toBe(22);

    // Verify update
    const getResponse = await request(app).get('/api/products/1');
    expect(getResponse.body.name).toBe('Updated Smart Bulb');
  });

  it('DELETE /api/products/:id - should delete a product', async () => {
    // Current state might have 4 products if create test ran. Let's target product id 2.
    const response = await request(app).delete('/api/products/2');
    expect(response.statusCode).toBe(200);
    expect(response.body.id).toBe(2); // Check if the deleted product is returned

    // Verify product is deleted
    const getResponse = await request(app).get('/api/products/2');
    expect(getResponse.statusCode).toBe(404);

    const allProductsResponse = await request(app).get('/api/products');
    // Number of products depends on whether create test ran and what was deleted.
    // If id:4 (Test Product) and id:2 (Smart Plug) were affected. Original 3. +1 (Test Prod) -1 (Smart Plug) = 3
    expect(allProductsResponse.body.find(p => p.id === 2)).toBeUndefined();
  });


});

describe('Contact API Endpoint', () => {
  it('POST /api/contact - should accept valid contact form submission', async () => {
    const submission = { name: 'Test User', email: 'test@example.com', message: 'Hello server!' };
    const response = await request(app)
      .post('/api/contact')
      .send(submission);
    expect(response.statusCode).toBe(200);
    expect(response.body.message).toBe('Contact form submitted successfully!');
  });

  it('POST /api/contact - should return 400 for missing fields', async () => {
    const submission = { name: 'Test User Only Name' }; // Missing email and message
    const response = await request(app)
      .post('/api/contact')
      .send(submission);
    expect(response.statusCode).toBe(400);
    expect(response.text).toBe('Missing required fields: name, email, message');
  });
});
