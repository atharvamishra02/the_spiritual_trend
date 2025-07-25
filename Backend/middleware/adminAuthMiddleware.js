import jwt from 'jsonwebtoken';
import Admin from '../models/Admin.js';

export const adminProtect = async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer ')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }
  if (!token) return res.status(401).json({ message: 'Not authorized, no token' });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded.isAdmin) return res.status(403).json({ message: 'Not an admin' });
    const admin = await Admin.findById(decoded.id).select('-password');
    if (!admin) return res.status(401).json({ message: 'Admin not found' });
    req.admin = admin;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token failed or expired' });
  }
}; 