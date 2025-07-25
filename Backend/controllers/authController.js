import jwt from "jsonwebtoken";
import User from "../models/User.js";

const generateToken = (res, userId) => {
  console.log('JWT_SECRET:', process.env.JWT_SECRET);
  console.log('JWT_EXPIRE:', process.env.JWT_EXPIRE);
  
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined in environment variables');
  }
  
  const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || "30d",
  });

  res.cookie("jwt", token, {
    httpOnly: true,
    secure: false, // Changed to false for localhost development
    sameSite: "lax", // Changed to lax for localhost development
    maxAge: 3 * 24 * 60 * 60 * 1000, // 3 days
  });

  return token;
};

// Helper functions
const generateAccessToken = (admin) => {
  return jwt.sign(
    { id: admin._id, isAdmin: true },
    process.env.JWT_SECRET,
    { expiresIn: '15m' }
  );
};

const generateRefreshToken = (admin) => {
  return jwt.sign(
    { id: admin._id, isAdmin: true },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: '7d' }
  );
};

// Refresh token endpoint
export const refreshAdminToken = async (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) return res.status(401).json({ message: 'No refresh token' });
  try {
    const payload = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    // Optionally: check if refreshToken is in DB or valid for this admin
    const newAccessToken = generateAccessToken({ _id: payload.id });
    res.json({ accessToken: newAccessToken });
  } catch (err) {
    res.status(403).json({ message: 'Invalid or expired refresh token' });
  }
};

export const signup = async (req, res) => {
  console.log('Signup request received:', req.body);
  
  const { firstName, lastName, email, mobile, password } = req.body;
  
  try {
    const existing = await User.findOne({ email });
    if (existing) {
      console.log('Email already exists:', email);
      return res.status(400).json({ msg: "Email already in use" });
    }

    const user = await User.create({
      firstName,
      lastName,
      email,
      mobile,
      password,
    });
    
    console.log('User created successfully:', user._id);
    const token = generateToken(res, user._id);
    // Emit notification to admin panel
    if (global.io) {
      global.io.emit('notification', {
        type: 'user_signup',
        message: `New user signed up: ${user.email}`,
        timestamp: new Date().toISOString()
      });
    }
    res
      .status(201)
      .json({
        msg: "Signup successful",
        token,
        user: {
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          mobile: user.mobile,
          address: user.address,
        },
      });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ msg: "Server error during signup" });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user || !(await user.matchPassword(password))) {
    return res.status(401).json({ msg: "Invalid credentials" });
  }
  
  const token = generateToken(res, user._id);
  // Emit notification to admin panel
  if (global.io) {
    global.io.emit('notification', {
      type: 'user_login',
      message: `User ${user.email} logged in`,
      timestamp: new Date().toISOString()
    });
  }
  res.status(200).json({
    msg: "Login successful",
    token,
    user: {
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      mobile: user.mobile,
      address: user.address,
    },
  });
};

export const logout = (req, res) => {
  res.clearCookie("jwt");
  res.json({ msg: "Logged out" });
};

export const getMe = async (req, res) => {
  const user = await User.findById(req.userId).select("-password");
  res.json(user);
};

export const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ msg: 'User not found' });

    user.firstName = req.body.firstName || user.firstName;
    user.lastName = req.body.lastName || user.lastName;
    user.mobile = req.body.mobile || user.mobile;
    
    // Handle address update with new structure
    if (req.body.address) {
      user.address = {
        address1: req.body.address.address1 || user.address.address1 || '',
        address2: req.body.address.address2 || user.address.address2 || '',
        city: req.body.address.city || user.address.city || '',
        state: req.body.address.state || user.address.state || '',
        pincode: req.body.address.pincode || user.address.pincode || ''
      };
    }
    
    await user.save();

    res.json({
      msg: 'Profile updated',
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        mobile: user.mobile,
        address: user.address,
      },
    });
  } catch (err) {
    res.status(500).json({ msg: 'Server error updating profile' });
  }
};

export const updateAddress = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ msg: 'User not found' });

    const { address1, address2, city, state, pincode } = req.body;
    
    // Validate required fields
    if (!address1 || !city || !state || !pincode) {
      return res.status(400).json({ msg: 'Please provide all required address fields' });
    }

    // Update address
    user.address = {
      address1: address1,
      address2: address2 || '',
      city: city,
      state: state,
      pincode: pincode
    };
    
    await user.save();

    res.json({
      msg: 'Address saved successfully',
      address: user.address,
    });
  } catch (err) {
    console.error('Address update error:', err);
    res.status(500).json({ msg: 'Server error saving address' });
  }
};

export default generateToken;
