import express from 'express';
import Student from '../models/Student.js';

const router = express.Router();

// Get all students
router.get('/', async (req, res) => {
  try {
    const students = await Student.find({ schoolType: req.user.schoolType });
    res.json(students);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add new student
router.post('/', async (req, res) => {
  const student = new Student({ ...req.body, schoolType: req.user.schoolType });
  try {
    const newStudent = await student.save();
    res.status(201).json(newStudent);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update student
router.put('/:id', async (req, res) => {
  try {
    const updatedStudent = await Student.findOneAndUpdate({ _id: req.params.id, schoolType: req.user.schoolType }, req.body, { new: true });
    res.json(updatedStudent);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete student
router.delete('/:id', async (req, res) => {
  try {
    await Student.findOneAndDelete({ _id: req.params.id, schoolType: req.user.schoolType });
    res.json({ message: 'Student deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
