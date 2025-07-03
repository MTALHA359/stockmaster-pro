import mongoose from "mongoose";

const PurchaseSchema = new mongoose.Schema({
  product: { type: String, required: true },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true },
  shopName: { type: String },
  address: { type: String },
  contact: { type: String },
  date: { type: Date, default: Date.now },
});

export default mongoose.models.Purchase ||
  mongoose.model("Purchase", PurchaseSchema);
