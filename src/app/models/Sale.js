import mongoose from "mongoose";

const SaleSchema = new mongoose.Schema({
  product: { type: String, required: true },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true },
  date: { type: Date, default: Date.now },
  shopName: { type: String },
  // add more fields if you want
});

export default mongoose.models.Sale || mongoose.model("Sale", SaleSchema);
