import Admin from '../models/Admin.js';

/**
 * Seeds the default admin user if they don't already exist.
 */
export const seedAdmin = async () => {
  try {
    const email = 'admin@thespritualtrends.com';
    const adminExists = await Admin.findOne({ email });

    if (!adminExists) {
      console.log(`[Seed] Admin user "${email}" not found. Creating default admin...`);
      const admin = new Admin({
        email,
        password: 'admin123',
        name: 'Super Admin',
        isSuperAdmin: true
      });
      await admin.save();
      console.log('✅ [Seed] Default admin user created successfully.');
    } else {
      console.log('[Seed] Admin user already exists. Skipping seeding.');
    }
  } catch (error) {
    console.error('❌ [Seed] Error seeding default admin:', error);
  }
};
