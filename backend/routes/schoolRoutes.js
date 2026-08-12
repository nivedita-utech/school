import express from 'express';
import bcrypt from 'bcryptjs';
import School from '../models/School.js';
import User from '../models/User.js';

const router = express.Router();

// Get all schools
router.get('/', async (req, res) => {
  try {
    if (req.user.role !== 'super_admin') {
      return res.status(403).json({ message: 'Forbidden' });
    }
    const schools = await School.find();
    res.json(schools);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a new school and its admin
router.post('/', async (req, res) => {
  const { name, address, contactEmail, adminEmail, adminPassword } = req.body;
  try {
    if (req.user.role !== 'super_admin') {
      return res.status(403).json({ message: 'Forbidden' });
    }
    
    // Check if admin email is already used
    const existingUser = await User.findOne({ email: adminEmail });
    if (existingUser) {
      return res.status(400).json({ message: 'Admin email already in use' });
    }

    const school = await School.create({ name, address, contactEmail });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(adminPassword, salt);
    
    await User.create({
      email: adminEmail,
      password: hashedPassword,
      role: 'school_admin',
      schoolId: school._id
    });

    res.status(201).json(school);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
