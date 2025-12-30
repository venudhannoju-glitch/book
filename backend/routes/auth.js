const express = require('express')
const router = express.Router()
const { verifyToken } = require('../middleware/auth')
const User = require('../models/User')

// Verify token and create or update user record
// This endpoint verifies the Firebase ID token, enforces allowed domain(s), and returns the app user record
router.post('/verify', verifyToken, async (req, res) => {
  try {
    const decoded = req.firebaseUser
    if (!decoded) return res.status(401).json({ message: 'Invalid token' })

    // getOrCreate will enforce allowed domain(s)
    const { getOrCreateUserFromDecoded } = require('../middleware/auth')
    try {
      const user = await getOrCreateUserFromDecoded(decoded)
      return res.json({ user })
    } catch (domainErr){
      if (domainErr.code === 'DOMAIN_NOT_ALLOWED') return res.status(403).json({ message: 'Email domain not allowed' })
      throw domainErr
    }
  } catch (err){
    console.error(err)
    res.status(500).json({ message: 'Server error' })
  }
})

module.exports = router
