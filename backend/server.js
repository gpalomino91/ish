const express = require('express');
const cors = require('cors'); // For allowing cross-origin requests from Angular frontend

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors()); // Enable CORS for all routes
app.use(express.json()); // To parse JSON bodies

// In-memory data store (for now)
let products = [
  { id: 1, name: 'Smart Bulb', description: 'Color changing smart bulb', price: 20, imageUrl: 'assets/smart-bulb.jpg' },
  { id: 2, name: 'Smart Plug', description: 'Control your appliances remotely', price: 15, imageUrl: 'assets/smart-plug.jpg' },
  { id: 3, name: 'Security Camera', description: 'HD security camera with night vision', price: 50, imageUrl: 'assets/security-camera.jpg' }
];
let nextProductId = 4;

// --- Product API Endpoints ---

// GET all products
app.get('/api/products', (req, res) => {
  res.json(products);
});

// GET a single product by ID
app.get('/api/products/:id', (req, res) => {
  const product = products.find(p => p.id === parseInt(req.params.id));
  if (!product) {
    return res.status(404).send('Product not found');
  }
  res.json(product);
});

// POST (create) a new product
app.post('/api/products', (req, res) => {
  const { name, description, price, imageUrl } = req.body;
  if (!name || !description || price === undefined) {
    return res.status(400).send('Missing required fields: name, description, price');
  }
  const newProduct = {
    id: nextProductId++,
    name,
    description,
    price,
    imageUrl
  };
  products.push(newProduct);
  res.status(201).json(newProduct);
});

// PUT (update) a product by ID
app.put('/api/products/:id', (req, res) => {
  const productIndex = products.findIndex(p => p.id === parseInt(req.params.id));
  if (productIndex === -1) {
    return res.status(404).send('Product not found');
  }
  const { name, description, price, imageUrl } = req.body;
  products[productIndex] = {
    ...products[productIndex],
    name: name || products[productIndex].name,
    description: description || products[productIndex].description,
    price: price === undefined ? products[productIndex].price : price,
    imageUrl: imageUrl || products[productIndex].imageUrl
  };
  res.json(products[productIndex]);
});

// DELETE a product by ID
app.delete('/api/products/:id', (req, res) => {
  const productIndex = products.findIndex(p => p.id === parseInt(req.params.id));
  if (productIndex === -1) {
    return res.status(404).send('Product not found');
  }
  const deletedProduct = products.splice(productIndex, 1);
  res.json(deletedProduct[0]);
});

// --- Contact Form API Endpoint ---
app.post('/api/contact', (req, res) => {
  const { name, email, message } = req.body;
  if (!name || !email || !message) {
    return res.status(400).send('Missing required fields: name, email, message');
  }
  // For now, just log the submission. In a real app, youd email this or save to DB.
  console.log('Contact form submission:');
  console.log({ name, email, message });
  res.status(200).send({ message: 'Contact form submitted successfully!' });
});

// Start server only if this script is run directly (not required by a test)
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
}

module.exports = app; // Export for testing
