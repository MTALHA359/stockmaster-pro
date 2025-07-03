import mongoose from "mongoose";

const SaleSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
  sku: { type: String, required: true },
  quantity: { type: Number, required: true },
  salePrice: { type: Number, required: true },
  date: { type: Date, default: Date.now }
});

export default mongoose.models.Sale || mongoose.model("Sale", SaleSchema);
