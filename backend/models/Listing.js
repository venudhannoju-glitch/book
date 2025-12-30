const { Schema, model, Types } = require('mongoose')

const listingSchema = new Schema({
  title: { type: String, required: true },
  author: { type: String },
  edition: { type: String },
  price: { type: Number, required: true },
  images: [{ type: String }],
  courseCode: { type: String },
  syllabusYear: { type: Number },
  condition: { type: Number, min:1, max:5 },
  seller: { type: Types.ObjectId, ref: 'User', required: true },
  location: { type: String },
  status: { type: String, enum: ['active','sold','removed'], default: 'active' },
  verified: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
})

// Add text index to support simple search across title/author/courseCode
listingSchema.index({ title: 'text', author: 'text', courseCode: 'text' })

module.exports = model('Listing', listingSchema)
