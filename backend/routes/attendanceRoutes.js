import express from 'express';
import StudentAttendance from '../models/StudentAttendance.js';
import FacultyAttendance from '../models/FacultyAttendance.js';

const router = express.Router();

// Student Attendance
router.post('/student', async (req, res) => {
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
    
    const attendance = await StudentAttendance.find(query).populate('records.student');
    res.status(200).json(attendance);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Faculty Attendance
router.post('/faculty', async (req, res) => {
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
