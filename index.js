import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

import ProductModel from './Schema/Products.js';
dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Welcome to the API');
});



app.get('/products', async (req, res) => {
    const result = await ProductModel.find().sort({reviews: -1, rating: -1}).limit(12);
    res.json(result);
})

app.get('/all-products', async (req, res) => {
     const result = await ProductModel.find({ isNewArrival: true }).lean();
    res.json(result);
})
























mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('Connected to MongoDB');
}).catch(err => {
  console.error('Error connecting to MongoDB:', err);
});
app.listen(process.env.PORT || 3000, () => {
  console.log(`Server is running on port ${process.env.PORT || 3000}`);
});

