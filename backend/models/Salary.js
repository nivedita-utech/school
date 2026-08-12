import mongoose from 'mongoose';

const salarySchema = new mongoose.Schema({
  schoolType: { type: String, enum: ['junior', 'senior'], required: true },
  facultyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Faculty', required: true },
  amount: { type: Number, required: true },
  month: { type: String, required: true }, // e.g., 'August 2026'
  paymentDate: { type: Date, default: Date.now },
  status: { type: String, enum: ['Paid', 'Pending', 'Failed'], default: 'Paid' }
}, { timestamps: true });

export default mongoose.model('Salary', salarySchema);
