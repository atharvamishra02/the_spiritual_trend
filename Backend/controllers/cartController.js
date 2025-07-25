import Cart from '../models/cartModel.js';
import mongoose from 'mongoose';
import Product from '../models/Product.js';

// ✅ Add item to cart
export const addToCart = async (req, res) => {
  let { productId, name, price, quantity } = req.body;
  const userId = req.user._id;  // Comes from protect middleware

  try {
    // Accept both MongoDB ObjectIds and string IDs
    let productIdToUse = productId;
    if (mongoose.Types.ObjectId.isValid(productId)) {
      productIdToUse = new mongoose.Types.ObjectId(productId);
    }

    let cart = await Cart.findOne({ user: userId });

    if (!cart) {
      cart = new Cart({ user: userId, items: [] });
    }

    const existingItemIndex = cart.items.findIndex(
      item => item.productId.toString() === productIdToUse.toString()
    );

    if (existingItemIndex !== -1) {
      cart.items[existingItemIndex].quantity += quantity || 1;
    } else {
      cart.items.push({ productId: productIdToUse, name, price, quantity: quantity || 1 });
    }

    await cart.save();
    // Emit notification to admin panel
    if (global.io) {
      global.io.emit('notification', {
        type: 'cart_update',
        message: `Cart updated for user ${userId}`,
        timestamp: new Date().toISOString()
      });
    }
    // Return items array directly for frontend compatibility
    res.status(200).json(cart.items);
  } catch (error) {
    console.error('Add to cart error:', error);
    res.status(500).json({ message: 'Failed to add item to cart' });
  }
};

// ✅ Get logged-in user's cart
export const getMyCart = async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id });
  // Return items array directly for frontend compatibility
  res.status(200).json(cart?.items || []);
};

// ✅ Remove item from cart
export const removeFromCart = async (req, res) => {
  const { productId } = req.params;
  const cart = await Cart.findOne({ user: req.user._id });

  if (!cart) return res.status(404).json({ message: 'Cart not found' });

  cart.items = cart.items.filter(
    item => item.productId.toString() !== productId.toString()
  );

  await cart.save();
  // Emit notification to admin panel
  if (global.io) {
    global.io.emit('notification', {
      type: 'cart_update',
      message: `Cart updated for user ${req.user._id}`,
      timestamp: new Date().toISOString()
    });
  }
  // Return items array directly for frontend compatibility
  res.status(200).json(cart.items);
};

// ✅ Admin: Get any user's cart
export const getUserCartById = async (req, res) => {
  const cart = await Cart.findOne({ user: req.params.userId });
  if (!cart) return res.status(404).json({ message: 'Cart not found' });
  res.status(200).json(cart);
};

// ✅ Admin: Get all user carts updated in the last 10 days
export const getAllCarts = async (req, res) => {
  try {
    const tenDaysAgo = new Date();
    tenDaysAgo.setDate(tenDaysAgo.getDate() - 10);

    // Find all carts updated in the last 10 days, populate user info
    const carts = await Cart.find({
      updatedAt: { $gte: tenDaysAgo }
    })
      .populate('user', 'name email')
      .sort({ updatedAt: -1 })
      .lean();

    // For each cart, populate product details for each item
    for (const cart of carts) {
      for (const item of cart.items) {
        if (item.productId) {
          // Try to fetch product details if productId is a valid ObjectId
          try {
            const product = await Product.findById(item.productId).lean();
            if (product) {
              item.product = {
                name: product.name,
                price: product.price,
                image: product.image
              };
            }
          } catch (e) {
            // Ignore errors for invalid productId
          }
        }
      }
    }

    // Calculate total price for each cart
    const cartsWithTotal = carts.map(cart => {
      const totalPrice = (cart.items || []).reduce((sum, item) => sum + (item.price * item.quantity), 0);
      return { ...cart, totalPrice };
    });

    res.status(200).json(cartsWithTotal);
  } catch (error) {
    console.error('Get all carts error:', error);
    res.status(500).json({ message: 'Failed to fetch carts' });
  }
};
