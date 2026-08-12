import express from 'express';
import Faculty from '../models/Faculty.js';

const router = express.Router();

// Get all faculty
router.get('/', async (req, res) => {
  try {
    const faculty = await Faculty.find({ schoolType: req.user.schoolType });
    res.json(faculty);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add new faculty
router.post('/', async (req, res) => {
  const faculty = new Faculty({ ...req.body, schoolType: req.user.schoolType });
  try {
    const newFaculty = await faculty.save();
    res.status(201).json(newFaculty);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update faculty
router.put('/:id', async (req, res) => {
  try {
    const updatedFaculty = await Faculty.findOneAndUpdate({ _id: req.params.id, schoolType: req.user.schoolType }, req.body, { new: true });
    res.json(updatedFaculty);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete faculty
router.delete('/:id', async (req, res) => {
  try {
    await Faculty.findOneAndDelete({ _id: req.params.id, schoolType: req.user.schoolType });
    res.json({ message: 'Faculty deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
