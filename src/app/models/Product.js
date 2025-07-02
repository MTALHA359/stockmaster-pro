import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  sku: { type: String, required: true, unique: true },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true },
});

const Product =
  mongoose.models.Product || mongoose.model("Product", ProductSchema);

export default Product;
