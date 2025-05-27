import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  category: String,
  price: {
    type: Number,
    required: true,
  },
  discountPrice: Number,
  stock: {
    type: Number,
    default: 0,
  },
  rating: {
    type: Number,
    default: 0,
  },
  reviews: {
    type: Number,
    default: 0,
  },
  description: String,
  defaultColorImage: String,
  colorOptions: [String],
  colorImages: {
    type: Map,
    of: String,
  },
  material: String,
  dimensions: {
    width: String,
    height: String,
    depth: String,
  },
  features: [String],
  sku: {
    type: String,
    unique: true,
  },
  isFeatured: {
    type: Boolean,
    default: false,
  },
  isNewArrival: {
    type: Boolean,
    default: true,
  },
  tags: [String],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});


const ProductModel = mongoose.model("Product", productSchema);

export default ProductModel;
