import User from '../models/User.js';
import logger from './winston.js';

export const seedDemoCredentials = async () => {
  try {
    logger.info('Initializing workspace credentials verification...');

    const seedAccounts = [
      {
        fullName: 'Dev Sharma',
        email: 'dev1973sharma@gmail.com',
        password: 'password123',
        role: 'Admin',
      },
      {
        fullName: 'Demo Admin',
        email: 'admin@enclave.com',
        password: 'password123',
        role: 'Admin',
      },
      {
        fullName: 'Demo User',
        email: 'user@enclave.com',
        password: 'password123',
        role: 'User',
      }
    ];

    for (const account of seedAccounts) {
      const existingUser = await User.findOne({ email: account.email });
      
      if (!existingUser) {
        // Create user if not present
        await User.create(account);
        logger.info(`Seeded credentials for: ${account.email} / password123 (Role: ${account.role})`);
      } else {
        // Enforce password sync to prevent "login is not working" issues
        existingUser.password = account.password; // model pre-save hook will hash it
        await existingUser.save();
        logger.info(`Verified & synchronized credentials for: ${account.email} / password123`);
      }
    }

    logger.info('All workspace demo credentials verified and active.');
  } catch (error) {
    logger.error(`Error verifying/seeding database credentials: ${error.message}`);
  }
};
