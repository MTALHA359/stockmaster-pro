import mongoose from 'mongoose';

const SaleSchema = new mongoose.Schema({
  items: [
    {
      productId: String,
      name: String,
      quantity: Number,
      price: Number,
    },
  ],
  total: Number,
  date: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.Sale || mongoose.model('Sale', SaleSchema);
