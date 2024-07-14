const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const productRoutes = require('../routes/productRoutes');
const Product = require('../models/Product');

dotenv.config();

const app = express();
app.use(express.json());
app.use('/api', productRoutes);

beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
});

afterAll(async () => {
    await mongoose.disconnect();
});

describe('Product API', () => {
    it('should create a new product', async () => {
        const res = await request(app)
            .post('/api/products')
            .send({
                name: 'Test Product',
                price: 10,
                description: 'Test Description',
            });

        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty('_id');
    });

    it('should fetch all products', async () => {
        const res = await request(app).get('/api/products');
        expect(res.statusCode).toEqual(200);
        expect(res.body.length).toBeGreaterThan(0);
    });

    it('should fetch a product by ID', async () => {
        const product = await Product.create({
            name: 'Test Product',
            price: 10,
            description: 'Test Description',
        });

        const res = await request(app).get(`/api/products/${product._id}`);
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('_id', product._id.toString());
    });

    it('should update a product by ID', async () => {
        const product = await Product.create({
            name: 'Test Product',
            price: 10,
            description: 'Test Description',
        });

        const res = await request(app)
            .put(`/api/products/${product._id}`)
            .send({ name: 'Updated Product' });

        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('name', 'Updated Product');
    });

    it('should delete a product by ID', async () => {
        const product = await Product.create({
            name: 'Test Product',
            price: 10,
            description: 'Test Description',
        });

        const res = await request(app).delete(`/api/products/${product._id}`);
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('message', 'Product deleted');
    });
});
