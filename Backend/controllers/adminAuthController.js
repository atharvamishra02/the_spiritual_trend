import Admin from '../models/Admin.js';
import jwt from 'jsonwebtoken';

export const adminLogin = async (req, res) => {
  const { email, password } = req.body;
  
  console.log('Admin login attempt:', { email, password: password ? '***' : 'missing' });
  
  try {
    const admin = await Admin.findOne({ email });
    console.log('Admin found:', admin ? 'Yes' : 'No');
    
    if (!admin) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    const isPasswordValid = await admin.matchPassword(password);
    console.log('Password valid:', isPasswordValid);
    
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const token = jwt.sign(
      { id: admin._id, isAdmin: true },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE || '30d' }
    );
    res.status(200).json({
      token,
      admin: { id: admin._id, email: admin.email, name: admin.name, isSuperAdmin: admin.isSuperAdmin }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error during admin login' });
  }
}; 