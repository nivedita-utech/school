import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import studentRoutes from './routes/studentRoutes.js';
import facultyRoutes from './routes/facultyRoutes.js';
import salaryRoutes from './routes/salaryRoutes.js';
import authRoutes from './routes/authRoutes.js';
import attendanceRoutes from './routes/attendanceRoutes.js';
import feeRoutes from './routes/feeRoutes.js';
import examRoutes from './routes/examRoutes.js';
import timetableRoutes from './routes/timetableRoutes.js';
import protect from './middleware/authMiddleware.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/schoolDB')
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.error('MongoDB Connection Error:', err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/students', protect, studentRoutes);
app.use('/api/faculty', protect, facultyRoutes);
app.use('/api/salary', protect, salaryRoutes);
app.use('/api/attendance', protect, attendanceRoutes);
app.use('/api/fees', protect, feeRoutes);
app.use('/api/exams', protect, examRoutes);
app.use('/api/timetable', protect, timetableRoutes);

app.get('/', (req, res) => {
  res.send('School Management API is running...');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
