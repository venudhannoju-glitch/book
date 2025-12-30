const Listing = require('../models/Listing')
const { getOrCreateUserFromDecoded } = require('./auth')

async function ensureAppUser(req, res, next){
  try {
    // If req.user already set by verifyToken, keep it
    if (req.user) return next()
    const decoded = req.firebaseUser
    if (!decoded) return res.status(401).json({ message: 'Unauthorized' })
    const user = await getOrCreateUserFromDecoded(decoded)
    req.user = user
    next()
  } catch (err){
    console.error('ensureAppUser error', err)
    return res.status(500).json({ message: 'Server error' })
  }
}

async function isAdmin(req, res, next){
  if (!req.user) return res.status(401).json({ message: 'Unauthorized' })
  if (req.user.role !== 'admin') return res.status(403).json({ message: 'Admin only' })
  next()
}

async function isOwnerOrAdmin(req, res, next){
  try {
    if (!req.user) return res.status(401).json({ message: 'Unauthorized' })
    const listingId = req.params.id
    const listing = await Listing.findById(listingId)
    if (!listing) return res.status(404).json({ message: 'Listing not found' })
    // owner check
    if (listing.seller && listing.seller.toString() === req.user._id.toString()){
      req.listing = listing
      return next()
    }
    if (req.user.role === 'admin'){
      req.listing = listing
      return next()
    }
    return res.status(403).json({ message: 'Not allowed' })
  } catch (err){
    console.error(err)
    res.status(500).json({ message: 'Server error' })
  }
}

module.exports = { ensureAppUser, isAdmin, isOwnerOrAdmin }