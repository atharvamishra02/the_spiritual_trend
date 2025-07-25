import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String, required: true },
  images: [{ 
    id: String, 
    url: String, 
    name: String 
  }],
  category: { type: String, required: true },
  stock: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
  
  // Home page placement options
  showOnHomePage: { type: Boolean, default: false },
  homePageSection: { 
    type: String, 
    enum: ['featured', 'famous', 'new', 'none'], 
    default: 'none' 
  },
  homePageOrder: { type: Number, default: 0 },
  
  // Page generation options
  generatePage: { type: Boolean, default: false },
  pageName: { type: String }, // e.g., "Rings", "Necklaces"
  pageSlug: { type: String }, // e.g., "rings", "necklaces"
  pageTitle: { type: String }, // e.g., "The Ring Trend"
  pageDescription: { type: String },
  pageVideo: { type: String }, // video file path
  
  // Additional metadata
  tags: [String],
  isFeatured: { type: Boolean, default: false },
  isNew: { type: Boolean, default: false },
  isPopular: { type: Boolean, default: false }
}, { timestamps: true });

export default mongoose.model('Product', productSchema); 