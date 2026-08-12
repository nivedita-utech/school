import mongoose from 'mongoose';

const feeSchema = new mongoose.Schema({
  schoolType: { type: String, enum: ['junior', 'senior'], required: true },
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  amount: { type: Number, required: true },
  dueDate: { type: Date, required: true },
  status: { type: String, enum: ['Pending', 'Paid', 'Overdue'], required: true, default: 'Pending' },
  paymentDate: { type: Date },
  receiptNumber: { type: String }
}, { timestamps: true });

export default mongoose.model('Fee', feeSchema);
