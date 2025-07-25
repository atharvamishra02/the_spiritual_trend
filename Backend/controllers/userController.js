import User from '../models/User.js';
import Product from '../models/Product.js';
import path from 'path';

// Get user's wishlist
export const getUserWishlist = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('wishlist');
    res.json(user.wishlist || []);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch wishlist', error: err.message });
  }
};

// Add product to wishlist
export const addToWishlist = async (req, res) => {
  try {
    const { productId } = req.body;
    console.log('Received productId:', productId, 'Type:', typeof productId);
    const product = await Product.findById(productId);
    console.log('Product found by ID:', product);
    if (!productId) return res.status(400).json({ message: 'Product ID required' });
    const user = await User.findById(req.user._id);
    console.log('Adding to wishlist:', productId);
    console.log('User wishlist before:', user.wishlist);
    if (!user.wishlist.includes(productId)) {
      user.wishlist.push(productId);
      await user.save();
    }
    console.log('User wishlist after:', user.wishlist);
    const updatedUser = await User.findById(req.user._id).populate('wishlist');
    console.log('Populated wishlist returned:', updatedUser.wishlist);
    res.json(updatedUser.wishlist);
  } catch (err) {
    res.status(500).json({ message: 'Failed to add to wishlist', error: err.message });
  }
};

// Remove product from wishlist
export const removeFromWishlist = async (req, res) => {
  try {
    const { productId } = req.params;
    const user = await User.findById(req.user._id);
    user.wishlist = user.wishlist.filter(id => id.toString() !== productId);
    await user.save();
    const updatedUser = await User.findById(req.user._id).populate('wishlist');
    res.json(updatedUser.wishlist);
  } catch (err) {
    res.status(500).json({ message: 'Failed to remove from wishlist', error: err.message });
  }
};

// Upload profile image
export const uploadProfileImage = async (req, res) => {
  try {
    console.log('Received file:', req.file);
    console.log('Authenticated user:', req.user);
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    user.profileImage = `/uploads/${req.file.filename}`;
    await user.save();
    res.json({ url: user.profileImage });
  } catch (err) {
    console.error('Failed to upload image:', err);
    res.status(500).json({ message: 'Failed to upload image', error: err.message, stack: err.stack });
  }
}; 