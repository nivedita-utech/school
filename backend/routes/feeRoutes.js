import express from 'express';
import Fee from '../models/Fee.js';
import { isAdmin } from '../middleware/roleMiddleware.js';

const router = express.Router();

router.post('/', isAdmin, async (req, res) => {
  try {
    const fee = new Fee({ ...req.body, schoolType: req.user.schoolType });
    await fee.save();
    res.status(201).json(fee);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const { student, status } = req.query;
    const query = { schoolType: req.user.schoolType };
    if (student) query.student = student;
    if (status) query.status = status;
    
    if (req.user.role === 'student' || req.user.role === 'parent') {
      query.student = req.user.studentId;
    }
    
    const fees = await Fee.find(query).populate('student');
    res.status(200).json(fees);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/:id/pay', isAdmin, async (req, res) => {
  try {
    const fee = await Fee.findOne({ _id: req.params.id, schoolType: req.user.schoolType });
    if (!fee) return res.status(404).json({ message: 'Fee record not found' });
    
    fee.status = 'Paid';
    fee.paymentDate = new Date();
    fee.receiptNumber = `REC-${Date.now()}`;
    await fee.save();
    
    res.status(200).json(fee);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
