import mongoose from 'mongoose';

const schoolSchema = new mongoose.Schema({
  name: { type: String, required: true },
  address: { type: String, required: true },
  contactEmail: { type: String, required: true },
}, { timestamps: true });

export default mongoose.model('School', schoolSchema);
