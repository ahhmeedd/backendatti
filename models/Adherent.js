const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const adherentSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  birthDate: { type: Date, required: true },
  profession: { type: String, required: true },
  password: { type: String, required: true },
  isAssociationMember: { type: Boolean, default: false },
  role: { type: String, enum: ['Member', 'BoardMember'], default: 'Member' },
  photoURL: { type: String },
}, { timestamps: true });

adherentSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

module.exports = mongoose.model('Adherent', adherentSchema);