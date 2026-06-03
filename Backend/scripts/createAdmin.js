import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import Admin from '../models/Admin.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env from Backend/.env
dotenv.config({ path: path.join(__dirname, '../.env') });

const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/spiritual-trend';

const createAdmin = async () => {
  try {
    console.log('Connecting to MongoDB using URI:', mongoURI);
    await mongoose.connect(mongoURI);
    console.log('✅ Connected to MongoDB.');

    const email = 'admin@thespritualtrends.com';
    const password = 'admin123';

    let admin = await Admin.findOne({ email });

    if (admin) {
      console.log(`Admin user with email "${email}" already exists. Updating password...`);
      admin.password = password; // Schema pre-save hook will hash this password
      await admin.save();
      console.log('✅ Admin password updated successfully.');
    } else {
      console.log(`Creating new admin user with email: "${email}"`);
      admin = new Admin({
        email,
        password,
        name: 'Super Admin',
        isSuperAdmin: true
      });
      await admin.save();
      console.log('✅ Admin user created successfully.');
    }

    // List all admins
    const admins = await Admin.find({}, '-password');
    console.log('Current Admin Users in database:');
    console.log(admins);

    await mongoose.disconnect();
    console.log('Disconnected from MongoDB.');
  } catch (error) {
    console.error('❌ Error creating/updating admin:', error);
    process.exit(1);
  }
};

createAdmin();
