import mongoose from 'mongoose';

const studentAttendanceSchema = new mongoose.Schema({
  date: { type: Date, required: true },
  class: { type: Number, required: true },
  section: { type: String, required: true },
  records: [{
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
    status: { type: String, enum: ['Present', 'Absent', 'Late', 'Half-day'], required: true, default: 'Present' }
  }]
}, { timestamps: true });

export default mongoose.model('StudentAttendance', studentAttendanceSchema);
