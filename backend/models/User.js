import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  schoolType: { type: String, enum: ['junior', 'senior'], required: true }
}, { timestamps: true });

export default mongoose.model('User', userSchema);
