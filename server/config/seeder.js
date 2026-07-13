import User from '../models/User.js';
import logger from './winston.js';

export const seedDemoCredentials = async () => {
  try {
    const userCount = await User.countDocuments({});
    
    if (userCount === 0) {
      logger.info('No users found in database. Seeding default demo credentials...');
      
      // Create Demo Admin (password will be hashed by User model pre-save hook)
      await User.create({
        fullName: 'Demo Admin',
        email: 'admin@enclave.com',
        password: 'password123',
        role: 'Admin',
      });

      // Create Demo User
      await User.create({
        fullName: 'Demo User',
        email: 'user@enclave.com',
        password: 'password123',
        role: 'User',
      });

      logger.info('Demo credentials seeded successfully:');
      logger.info('  Admin: admin@enclave.com / password123');
      logger.info('  User:  user@enclave.com  / password123');
    } else {
      logger.info('Database already has users. Skipping seeder.');
    }
  } catch (error) {
    logger.error(`Error seeding database: ${error.message}`);
  }
};
