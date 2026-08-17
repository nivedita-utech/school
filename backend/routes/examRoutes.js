import express from 'express';
import Exam from '../models/Exam.js';
import Result from '../models/Result.js';
import { isAdmin } from '../middleware/roleMiddleware.js';

const router = express.Router();

// Exams
router.post('/', isAdmin, async (req, res) => {
  try {
    const exam = new Exam({ ...req.body, schoolType: req.user.schoolType });
    await exam.save();
    res.status(201).json(exam);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const { class: examClass } = req.query;
    const query = { schoolType: req.user.schoolType };
    if (examClass) query.class = examClass;
    const exams = await Exam.find(query);
    res.status(200).json(exams);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Results
router.post('/results', isAdmin, async (req, res) => {
  try {
    const { exam, student, marksObtained, totalMarks } = req.body;
    const percentage = (marksObtained / totalMarks) * 100;
    
    let grade = 'F';
    if (percentage >= 90) grade = 'A+';
    else if (percentage >= 80) grade = 'A';
    else if (percentage >= 70) grade = 'B';
    else if (percentage >= 60) grade = 'C';
    else if (percentage >= 50) grade = 'D';

    let result = await Result.findOne({ exam, student, schoolType: req.user.schoolType });
    if (result) {
      result.marksObtained = marksObtained;
      result.totalMarks = totalMarks;
      result.grade = grade;
      await result.save();
    } else {
      result = new Result({ exam, student, marksObtained, totalMarks, grade, schoolType: req.user.schoolType });
      await result.save();
    }
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/results', async (req, res) => {
  try {
    const { exam, student } = req.query;
    const query = { schoolType: req.user.schoolType };
    if (exam) query.exam = exam;
    if (student) query.student = student;
    
    if (req.user.role === 'student' || req.user.role === 'parent') {
      query.student = req.user.studentId;
    }
    
    const results = await Result.find(query).populate('exam').populate('student');
    res.status(200).json(results);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
