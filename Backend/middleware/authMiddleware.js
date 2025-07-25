import jwt from 'jsonwebtoken';
import User from '../models/User.js'; // Adjust the path if needed

export const protect = async (req, res, next) => {
  let token;

  // Check for token in Authorization header
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer ')
  ) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies && req.cookies.jwt) {
    // Fallback: check for token in cookies
    token = req.cookies.jwt;
  }

  if (!token) return res.status(401).json({ msg: "Not authorized, no token" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Fetch the user from the database and attach to req.user
    const user = await User.findById(decoded.id).select('-password');
    if (!user) return res.status(401).json({ msg: "User not found" });
    req.user = user;
    next();
  } catch (err) {
    res.status(401).json({ msg: "Token failed or expired" });
  }
};
