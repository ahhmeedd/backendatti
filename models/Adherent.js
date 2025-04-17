// models/Adherent.js
const mongoose = require('mongoose');

const AdherentSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  birthdate: { type: Date, required: true },
  telephone: { type: String, required: true },
  profession: { type: String, required: true },
  password: { type: String, required: true },
  role: { type: String, default: 'adherent' },
  participations: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Event' 
  }]
});

module.exports = mongoose.model('Adherent', AdherentSchema);