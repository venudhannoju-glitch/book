const Listing = require('../models/Listing')
const User = require('../models/User')

exports.verifyListing = async (req, res) => {
  try {
    const listing = await Listing.findByIdAndUpdate(req.params.id, { verified: true }, { new: true })
    if (!listing) return res.status(404).json({ message: 'Listing not found' })
    res.json({ listing })
  } catch (err){
    console.error(err)
    res.status(500).json({ message: 'Server error' })
  }
}

exports.listPendingListings = async (req, res) => {
  try {
    const { page = 1, limit = 50 } = req.query
    const q = { verified: false, status: 'active' }
    const total = await Listing.countDocuments(q)
    const listings = await Listing.find(q).sort({ createdAt: -1 }).skip((page-1)*limit).limit(Number(limit)).populate('seller', 'name email')
    res.json({ listings, total, page: Number(page), perPage: Number(limit) })
  } catch (err){
    console.error(err)
    res.status(500).json({ message: 'Server error' })
  }
}

exports.removeListing = async (req, res) => {
  try {
    const listing = await Listing.findByIdAndUpdate(req.params.id, { status: 'removed' }, { new: true })
    if (!listing) return res.status(404).json({ message: 'Listing not found' })
    res.json({ listing })
  } catch (err){
    console.error(err)
    res.status(500).json({ message: 'Server error' })
  }
}

exports.listUsers = async (req, res) => {
  try {
    const { page = 1, limit = 50, q } = req.query
    const filter = {}
    if (q) filter.$or = [{ name: new RegExp(q, 'i') }, { email: new RegExp(q, 'i') }]
    const total = await User.countDocuments(filter)
    const users = await User.find(filter).sort({ createdAt: -1 }).skip((page-1)*limit).limit(Number(limit))
    res.json({ users, total, page: Number(page), perPage: Number(limit) })
  } catch (err){
    console.error(err)
    res.status(500).json({ message: 'Server error' })
  }
}

exports.updateUserRole = async (req, res) => {
  try {
    const { role } = req.body
    if (!['student','admin'].includes(role)) return res.status(400).json({ message: 'Invalid role' })
    const user = await User.findByIdAndUpdate(req.params.id, { role }, { new: true })
    if (!user) return res.status(404).json({ message: 'User not found' })
    res.json({ user })
  } catch (err){
    console.error(err)
    res.status(500).json({ message: 'Server error' })
  }
}
