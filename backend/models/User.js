const { Schema, model } = require('mongoose')

const userSchema = new Schema({
  firebaseUid: { type: String, required: true, unique: true },
  name: { type: String },
  email: { type: String, required: true, unique: true },
  college: { type: String },
  role: { type: String, enum: ['student','admin'], default: 'student' },
  verified: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
})

module.exports = model('User', userSchema)
