import express from 'express';
import bcrypt from 'bcryptjs';
import Student from '../models/Student.js';
import User from '../models/User.js';
import { isAdmin } from '../middleware/roleMiddleware.js';

const router = express.Router();

// Get all students (or own student if student/parent)
router.get('/', async (req, res) => {
  try {
    const query = { schoolType: req.user.schoolType };
    if (req.user.role === 'student' || req.user.role === 'parent') {
      query._id = req.user.studentId;
    }
    const students = await Student.find(query);
    res.json(students);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add new student
router.post('/', isAdmin, async (req, res) => {
  const { studentEmail, studentPassword, parentEmail, parentPassword, ...studentData } = req.body;
  
  try {
    const student = new Student({ 
      ...studentData, 
      studentEmail, 
      parentEmail, 
      schoolType: req.user.schoolType 
    });
    const newStudent = await student.save();

    const salt = await bcrypt.genSalt(10);
    
    if (studentEmail && studentPassword) {
      const hashedStudentPassword = await bcrypt.hash(studentPassword, salt);
      await User.create({
        email: studentEmail,
        password: hashedStudentPassword,
        schoolType: req.user.schoolType,
        role: 'student',
        studentId: newStudent._id
      });
    }

    if (parentEmail && parentPassword) {
      const hashedParentPassword = await bcrypt.hash(parentPassword, salt);
      await User.create({
        email: parentEmail,
        password: hashedParentPassword,
        schoolType: req.user.schoolType,
        role: 'parent',
        studentId: newStudent._id
      });
    }

    res.status(201).json(newStudent);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update student
router.put('/:id', isAdmin, async (req, res) => {
  try {
    const updatedStudent = await Student.findOneAndUpdate({ _id: req.params.id, schoolType: req.user.schoolType }, req.body, { new: true });
    res.json(updatedStudent);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete student
router.delete('/:id', isAdmin, async (req, res) => {
  try {
    await Student.findOneAndDelete({ _id: req.params.id, schoolType: req.user.schoolType });
    // Also delete associated User accounts
    await User.deleteMany({ studentId: req.params.id });
    res.json({ message: 'Student deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
