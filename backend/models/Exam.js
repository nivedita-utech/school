import mongoose from 'mongoose';

const examSchema = new mongoose.Schema({
  schoolType: { type: String, enum: ['junior', 'senior'], required: true },
  name: { type: String, required: true },
  class: { type: Number, required: true },
  date: { type: Date, required: true }
}, { timestamps: true });

export default mongoose.model('Exam', examSchema);
