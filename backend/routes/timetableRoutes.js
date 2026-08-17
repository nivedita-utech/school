import express from 'express';
import Timetable from '../models/Timetable.js';
import Student from '../models/Student.js';
import { isAdmin } from '../middleware/roleMiddleware.js';

const router = express.Router();

router.post('/', isAdmin, async (req, res) => {
  try {
    const { class: classNum, section, dayOfWeek, periods } = req.body;
    let timetable = await Timetable.findOne({ class: classNum, section, dayOfWeek, schoolType: req.user.schoolType });
    
    if (timetable) {
      timetable.periods = periods;
      await timetable.save();
    } else {
      timetable = new Timetable({ ...req.body, schoolType: req.user.schoolType });
      await timetable.save();
    }
    res.status(201).json(timetable);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const { class: classNum, section, dayOfWeek } = req.query;
    const query = { schoolType: req.user.schoolType };
    if (classNum) query.class = classNum;
    if (section) query.section = section;
    if (dayOfWeek) query.dayOfWeek = dayOfWeek;
    if (req.user.role === 'student' || req.user.role === 'parent') {
      const student = await Student.findById(req.user.studentId);
      if (student) {
        query.class = student.class;
        query.section = student.section;
      }
    }
    
    const timetables = await Timetable.find(query).populate('periods.faculty');
    res.status(200).json(timetables);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
