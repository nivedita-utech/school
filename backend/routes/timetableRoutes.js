import express from 'express';
import Timetable from '../models/Timetable.js';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { class: classNum, section, dayOfWeek, periods } = req.body;
    let timetable = await Timetable.findOne({ class: classNum, section, dayOfWeek });
    
    if (timetable) {
      timetable.periods = periods;
      await timetable.save();
    } else {
      timetable = new Timetable(req.body);
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
    const query = {};
    if (classNum) query.class = classNum;
    if (section) query.section = section;
    if (dayOfWeek) query.dayOfWeek = dayOfWeek;
    
    const timetables = await Timetable.find(query).populate('periods.faculty');
    res.status(200).json(timetables);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
