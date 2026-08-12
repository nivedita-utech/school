import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import User from './models/User.js';

dotenv.config();

mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/schoolDB')
  .then(async () => {
    console.log('MongoDB Connected');
    // Clear DB because schema changed
    await mongoose.connection.db.dropDatabase();
    console.log('Database cleared for schema update');
    
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('admin123', salt);
    
    await User.create({
      email: 'junior@school.com',
      password: hashedPassword,
      schoolType: 'junior'
    });
    console.log('Junior admin created: junior@school.com / admin123');

    await User.create({
      email: 'senior@school.com',
      password: hashedPassword,
      schoolType: 'senior'
    });
    console.log('Senior admin created: senior@school.com / admin123');
    
    process.exit();
  })
  .catch(err => {
    console.error('Connection Error:', err);
    process.exit(1);
  });
