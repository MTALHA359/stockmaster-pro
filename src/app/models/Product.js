

import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  sku: { type: String, required: true, unique: true },  // Stock Keeping Unit
  stock: { type: Number, required: true },
  purchasePrice: { type: Number },
  salePrice: { type: Number, required: true },
  category: { type: String },
  barcode: { type: String }, // optional
}, {
  timestamps: true
});

const Product = mongoose.models.Product || mongoose.model("Product", ProductSchema);
export default Product;
