import express from 'express';
import Fee from '../models/Fee.js';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const fee = new Fee(req.body);
    await fee.save();
    res.status(201).json(fee);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const { student, status } = req.query;
    const query = {};
    if (student) query.student = student;
    if (status) query.status = status;
    
    const fees = await Fee.find(query).populate('student');
    res.status(200).json(fees);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/:id/pay', async (req, res) => {
  try {
    const fee = await Fee.findById(req.params.id);
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
