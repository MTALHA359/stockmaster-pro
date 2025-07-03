import mongoose from "mongoose";

const saleSchema = new mongoose.Schema({
  product: { type: String, required: true },
  quantity: { type: Number, required: true },
  amount: { type: Number, required: true },
  date: { type: Date, default: Date.now },
});

const Sale = mongoose.models.Sale || mongoose.model("Sale", saleSchema);
export default Sale;
