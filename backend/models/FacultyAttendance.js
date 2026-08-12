import mongoose from 'mongoose';

const facultyAttendanceSchema = new mongoose.Schema({
  schoolType: { type: String, enum: ['junior', 'senior'], required: true },
  date: { type: Date, required: true, unique: true },
  records: [{
    faculty: { type: mongoose.Schema.Types.ObjectId, ref: 'Faculty', required: true },
    status: { type: String, enum: ['Present', 'Absent', 'Late', 'Half-day'], required: true, default: 'Present' }
  }]
}, { timestamps: true });

export default mongoose.model('FacultyAttendance', facultyAttendanceSchema);
