import express from 'express';
import Salary from '../models/Salary.js';

const router = express.Router();

// Get all salary records
router.get('/', async (req, res) => {
  try {
    const salaries = await Salary.find({ schoolType: req.user.schoolType }).populate('facultyId', 'name designation');
    res.json(salaries);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add new salary record
router.post('/', async (req, res) => {
  const salary = new Salary({ ...req.body, schoolType: req.user.schoolType });
  try {
    const newSalary = await salary.save();
    res.status(201).json(newSalary);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update salary
router.put('/:id', async (req, res) => {
  try {
    const updatedSalary = await Salary.findOneAndUpdate({ _id: req.params.id, schoolType: req.user.schoolType }, req.body, { new: true });
    res.json(updatedSalary);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

export default router;
