// src/models/Purchase.js
import mongoose from 'mongoose';

const PurchaseSchema = new mongoose.Schema({
  productName: String,
  supplierName: String,
  quantity: Number,
  date: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.Purchase || mongoose.model('Purchase', PurchaseSchema);
