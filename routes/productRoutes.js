const express = require('express');
const Product = require('../models/Product');
const protect = require('../middleware/authMiddleware');

const router = express.Router();

// Create a new product
router.post('/', protect, async (req, res) => {
    const { name, price, description } = req.body;

    try {
        const newProduct = new Product({ name, price, description });
        await newProduct.save();
        res.status(201).json(newProduct);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Get all products
router.get('/', async (req, res) => {
    try {
        const products = await Product.find();
        res.status(200).json(products);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get a single product by ID
router.get('/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.status(200).json(product);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Update a product by ID
router.put('/:id', protect, async (req, res) => {
    try {
        const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!updatedProduct) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.status(200).json(updatedProduct);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Delete a product by ID
router.delete('/:id', protect, async (req, res) => {
    try {
        const deletedProduct = await Product.findByIdAndDelete(req.params.id);
        if (!deletedProduct) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.status(200).json({ message: 'Product deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get all products with search and filtering
router.get('/products', async (req, res) => {
    const { keyword, minPrice, maxPrice } = req.query;

    const query = {
        ...(keyword && { name: { $regex: keyword, $options: 'i' } }),
        ...(minPrice && { price: { $gte: minPrice } }),
        ...(maxPrice && { price: { $lte: maxPrice } }),
    };

    try {
        const products = await Product.find(query);
        res.status(200).json(products);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get all products with search, filtering, and pagination
router.get('/products', async (req, res) => {
    const { keyword, minPrice, maxPrice, page = 1, limit = 10 } = req.query;

    const query = {
        ...(keyword && { name: { $regex: keyword, $options: 'i' } }),
        ...(minPrice && { price: { $gte: minPrice } }),
        ...(maxPrice && { price: { $lte: maxPrice } }),
    };

    try {
        const products = await Product.find(query)
            .skip((page - 1) * limit)
            .limit(Number(limit));

        const totalProducts = await Product.countDocuments(query);
        const totalPages = Math.ceil(totalProducts / limit);

        res.status(200).json({ products, totalPages });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});



module.exports = router;
