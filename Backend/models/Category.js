import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  image: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  order: { type: Number, default: 0 },
  video: { type: String }, // URL or file path for category video
  description: { type: String },
  productImages: [{ type: String }], // Array of product image URLs
}, { timestamps: true });

export default mongoose.model('Category', categorySchema); 