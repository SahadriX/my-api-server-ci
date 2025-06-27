console.log("📣 server.js from DESKTOP loaded");

const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const app = express();
const PORT = process.env.PORT || 5000;

// Optional flag to insert sample data if collection is empty
const INSERT_SAMPLE_ITEMS = true;

// Swagger Configuration
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Item API',
      version: '1.0.0',
      description: 'API for managing items in inventory',
    },
    servers: [{ url: `http://localhost:${PORT}` }],
  },
  apis: ['./server.js'],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Middleware
app.use(express.json());
app.use(express.static('public'));

// MongoDB Dual Connection Logic
const atlasUri = process.env.ATLAS_URI;
const localUri = process.env.MONGO_URI;
const useLocal = process.env.USE_LOCAL === 'true';
const mongoUri = useLocal ? localUri : atlasUri;

if (process.env.NODE_ENV !== 'test' && mongoUri) {
  console.log(`🔗 Connecting to ${useLocal ? "Local MongoDB" : "MongoDB Atlas"}`);
  mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log(`✅ Connected to ${useLocal ? "Local MongoDB" : "MongoDB Atlas"}`);

    // Optional: Insert sample data if DB is empty
    if (INSERT_SAMPLE_ITEMS) {
      Item.countDocuments().then(count => {
        if (count === 0) {
          const sampleItems = [
            { name: 'Sample Pen', price: 10, inStock: true },
            { name: 'Sample Notebook', price: 50, inStock: true },
            { name: 'Sample Eraser', price: 5, inStock: false }
          ];
          return Item.insertMany(sampleItems);
        }
      }).then(inserted => {
        if (inserted && inserted.length)
          console.log(`🧪 Inserted ${inserted.length} sample items`);
      }).catch(err => {
        console.error("❌ Error inserting sample data:", err.message);
      });
    }

    app.listen(PORT, () => {
      console.log(`🚀 Server running at http://localhost:${PORT}`);
      console.log(`📚 Swagger UI at http://localhost:${PORT}/api-docs`);
    });
  })
  .catch(err => {
    console.error("❌ MongoDB connection error:", err.message);
  });
}

// Mongoose Schema and Model
const itemSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  price: { type: Number, required: true, min: 0 },
  inStock: { type: Boolean, default: true }
}, { timestamps: true });

const Item = mongoose.model('Item', itemSchema);

/**
 * @swagger
 * components:
 *   schemas:
 *     Item:
 *       type: object
 *       required:
 *         - name
 *         - price
 *       properties:
 *         id:
 *           type: string
 *           example: 507f1f77bcf86cd799439011
 *         name:
 *           type: string
 *           example: Premium Widget
 *         price:
 *           type: number
 *           example: 29.99
 *         inStock:
 *           type: boolean
 *           example: true
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */

// CRUD Routes

/**
 * @swagger
 * /api/items:
 *   post:
 *     summary: Create a new item
 *     tags: [Items]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Item'
 *     responses:
 *       201:
 *         description: The created item
 */
app.post('/api/items', async (req, res) => {
  try {
    const item = new Item(req.body);
    const saved = await item.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

/**
 * @swagger
 * /api/items:
 *   get:
 *     summary: Get all items
 *     tags: [Items]
 *     responses:
 *       200:
 *         description: List of all items
 */
app.get('/api/items', async (req, res) => {
  try {
    const items = await Item.find().sort({ createdAt: -1 });
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

/**
 * @swagger
 * /api/items/{id}:
 *   get:
 *     summary: Get item by ID
 *     tags: [Items]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *     responses:
 *       200:
 *         description: Item data
 *       404:
 *         description: Not found
 */
app.get('/api/items/:id', async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id))
      return res.status(400).json({ error: 'Invalid ID' });

    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ error: 'Item not found' });
    res.json(item);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

/**
 * @swagger
 * /api/items/{id}:
 *   put:
 *     summary: Update item by ID
 *     tags: [Items]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Item'
 *     responses:
 *       200:
 *         description: Updated item
 */
app.put('/api/items/:id', async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id))
      return res.status(400).json({ error: 'Invalid ID' });

    const updated = await Item.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updated) return res.status(404).json({ error: 'Item not found' });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /api/items/{id}:
 *   delete:
 *     summary: Delete item by ID
 *     tags: [Items]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Item deleted
 */
app.delete('/api/items/:id', async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id))
      return res.status(400).json({ error: 'Invalid ID' });

    const deleted = await Item.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Item not found' });
    res.json({ message: 'Item deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Healthcheck/debug routes
app.get('/ping', (req, res) => res.send('pong'));

app.get('/debug', (req, res) => {
  res.json({
    status: 'active',
    mongoMode: useLocal ? 'local' : 'atlas',
    mongoUri: mongoUri ? 'present' : 'missing',
    time: new Date().toISOString()
  });
});

module.exports = app;
