const { Schema, model, Types } = require('mongoose')

const messageSchema = new Schema({
  listing: { type: Types.ObjectId, ref: 'Listing', required: true },
  from: { type: Types.ObjectId, ref: 'User', required: true },
  to: { type: Types.ObjectId, ref: 'User' },
  body: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
})

module.exports = model('Message', messageSchema)
