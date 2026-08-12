import mongoose from 'mongoose';

const timetableSchema = new mongoose.Schema({
  schoolType: { type: String, enum: ['junior', 'senior'], required: true },
  class: { type: Number, required: true },
  section: { type: String, required: true },
  dayOfWeek: { type: String, enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'], required: true },
  periods: [{
    time: { type: String, required: true }, // e.g. "09:00 - 09:45"
    subject: { type: String, required: true },
    faculty: { type: mongoose.Schema.Types.ObjectId, ref: 'Faculty', required: true }
  }]
}, { timestamps: true });

export default mongoose.model('Timetable', timetableSchema);
