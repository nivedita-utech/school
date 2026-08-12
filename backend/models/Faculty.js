import mongoose from 'mongoose';

const facultySchema = new mongoose.Schema({
  schoolType: { type: String, enum: ['junior', 'senior'], required: true },
  name: { type: String, required: true },
  subject: { type: String, required: true },
  designation: { type: String, required: true },
  contact: { type: String, required: true },
  dateOfJoining: { type: Date, default: Date.now },
  baseSalary: { type: Number, required: true }
}, { timestamps: true });

export default mongoose.model('Faculty', facultySchema);
