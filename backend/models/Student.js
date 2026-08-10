import mongoose from 'mongoose';

const studentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  age: { type: Number, required: true },
  class: { type: Number, required: true, min: 1, max: 10 },
  section: { type: String, enum: ['A', 'B', 'C', 'D'], required: true, default: 'A' },
  rollNumber: { type: String, required: true, unique: true },
  address: { type: String },
  parentContact: { type: String, required: true }
}, { timestamps: true });

export default mongoose.model('Student', studentSchema);
