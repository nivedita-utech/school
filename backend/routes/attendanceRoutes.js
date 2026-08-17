import express from 'express';
import StudentAttendance from '../models/StudentAttendance.js';
import FacultyAttendance from '../models/FacultyAttendance.js';
import Student from '../models/Student.js';
import { isAdmin } from '../middleware/roleMiddleware.js';

const router = express.Router();

// Student Attendance
router.post('/student', isAdmin, async (req, res) => {
  try {
    const { date, class: studentClass, section, records } = req.body;
    let attendance = await StudentAttendance.findOne({ date, class: studentClass, section, schoolType: req.user.schoolType });
    
    if (attendance) {
      attendance.records = records;
      await attendance.save();
    } else {
      attendance = new StudentAttendance({ date, class: studentClass, section, records, schoolType: req.user.schoolType });
      await attendance.save();
    }
    res.status(200).json(attendance);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/student', async (req, res) => {
  try {
    const { date, class: studentClass, section } = req.query;
    const query = { schoolType: req.user.schoolType };
    if (date) query.date = date;
    if (studentClass) query.class = studentClass;
    if (section) query.section = section;
    
    if (req.user.role === 'student' || req.user.role === 'parent') {
      const student = await Student.findById(req.user.studentId);
      if (student) {
        query.class = student.class;
        query.section = student.section;
      }
    }
    
    let attendance = await StudentAttendance.find(query).populate('records.student');
    
    // For students/parents, filter the records to only show their own attendance
    if (req.user.role === 'student' || req.user.role === 'parent') {
      attendance = attendance.map(att => {
        att.records = att.records.filter(r => r.student._id.toString() === req.user.studentId.toString());
        return att;
      });
    }
    
    res.status(200).json(attendance);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Faculty Attendance
router.post('/faculty', isAdmin, async (req, res) => {
  try {
    const { date, records } = req.body;
    let attendance = await FacultyAttendance.findOne({ date, schoolType: req.user.schoolType });
    
    if (attendance) {
      attendance.records = records;
      await attendance.save();
    } else {
      attendance = new FacultyAttendance({ date, records, schoolType: req.user.schoolType });
      await attendance.save();
    }
    res.status(200).json(attendance);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/faculty', async (req, res) => {
  try {
    const { date } = req.query;
    const query = { schoolType: req.user.schoolType };
    if (date) query.date = date;
    const attendance = await FacultyAttendance.find(query).populate('records.faculty');
    res.status(200).json(attendance);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
