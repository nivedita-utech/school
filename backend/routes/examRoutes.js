import express from 'express';
import Exam from '../models/Exam.js';
import Result from '../models/Result.js';

const router = express.Router();

// Exams
router.post('/', async (req, res) => {
  try {
    const exam = new Exam(req.body);
    await exam.save();
    res.status(201).json(exam);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const { class: examClass } = req.query;
    const query = examClass ? { class: examClass } : {};
    const exams = await Exam.find(query);
    res.status(200).json(exams);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Results
router.post('/results', async (req, res) => {
  try {
    const { exam, student, marksObtained, totalMarks } = req.body;
    const percentage = (marksObtained / totalMarks) * 100;
    
    let grade = 'F';
    if (percentage >= 90) grade = 'A+';
    else if (percentage >= 80) grade = 'A';
    else if (percentage >= 70) grade = 'B';
    else if (percentage >= 60) grade = 'C';
    else if (percentage >= 50) grade = 'D';

    let result = await Result.findOne({ exam, student });
    if (result) {
      result.marksObtained = marksObtained;
      result.totalMarks = totalMarks;
      result.grade = grade;
      await result.save();
    } else {
      result = new Result({ exam, student, marksObtained, totalMarks, grade });
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
    const query = {};
    if (exam) query.exam = exam;
    if (student) query.student = student;
    
    const results = await Result.find(query).populate('exam').populate('student');
    res.status(200).json(results);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
