const Message = require('../models/Message')

exports.sendMessage = async (req, res) => {
  try {
    const { listing, to, body } = req.body
    if (!listing || !body) return res.status(400).json({ message: 'Missing fields' })
    const msg = await Message.create({ listing, from: req.body.from || null, to, body })
    res.status(201).json({ message: msg })
  } catch (err){
    console.error(err)
    res.status(500).json({ message: 'Server error' })
  }
}

exports.getMessagesForListing = async (req, res) => {
  try {
    const { listingId } = req.params
    const messages = await Message.find({ listing: listingId }).sort('createdAt').populate('from to', 'name email')
    res.json({ messages })
  } catch (err){
    console.error(err)
    res.status(500).json({ message: 'Server error' })
  }
}
