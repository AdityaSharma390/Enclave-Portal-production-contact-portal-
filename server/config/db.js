import mongoose from 'mongoose';
import logger from './winston.js';
import { seedDemoCredentials } from './seeder.js';

const connectDB = async () => {
  const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/enclave_portal';
  
  try {
    const conn = await mongoose.connect(mongoURI);
    logger.info(`MongoDB Connected: ${conn.connection.host}`);
    
    // Seed demo accounts if database is empty
    await seedDemoCredentials();
  } catch (error) {
    logger.error(`Database connection error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
