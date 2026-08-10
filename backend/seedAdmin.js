import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import User from './models/User.js';

dotenv.config();

mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/schoolDB')
  .then(async () => {
    console.log('MongoDB Connected');
    
    // Check if admin exists
    const adminExists = await User.findOne({ email: 'admin@school.com' });
    if (!adminExists) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('admin123', salt);
      
      await User.create({
        email: 'admin@school.com',
        password: hashedPassword
      });
      console.log('Default admin created: admin@school.com / admin123');
    } else {
      console.log('Admin user already exists');
    }
    process.exit();
  })
  .catch(err => {
    console.error('Connection Error:', err);
    process.exit(1);
  });
