import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema({
  name: String,
  stock: Number,
  purchasePrice: Number,
  salePrice: Number,
  category: String,
  barcode: String,
});

export default mongoose.models.Product || mongoose.model('Product', ProductSchema);
