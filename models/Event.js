// models/Event.js
const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  location: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  maxParticipants: { type: Number, required: true },
  poster: { type: String, required: true }, // Store image path/URL
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Adherent'}]
}, { timestamps: true });

module.exports = mongoose.model('Event', EventSchema);