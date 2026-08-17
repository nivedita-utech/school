import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  schoolType: { type: String, enum: ['junior', 'senior'], required: true },
  role: { type: String, enum: ['admin', 'student', 'parent'], default: 'admin' },
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student' }
}, { timestamps: true });

export default mongoose.model('User', userSchema);
