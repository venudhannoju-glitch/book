const admin = require('firebase-admin')

// Initialize firebase-admin if credentials provided
function initFirebaseAdmin(){
  if (admin.apps && admin.apps.length) return
  const svc = process.env.FIREBASE_SERVICE_ACCOUNT_JSON
  if (!svc) {
    console.warn('FIREBASE_SERVICE_ACCOUNT_JSON not set — auth will fail if used')
    return
  }
  try {
    const parsed = JSON.parse(svc)
    admin.initializeApp({ credential: admin.credential.cert(parsed) })
    console.log('Firebase admin initialized')
  } catch (err){
    console.error('Failed to init firebase admin:', err.message)
  }
}

const User = require('../models/User')

// Helper: ensure a User exists for a Firebase decoded token; returns the DB user
async function getOrCreateUserFromDecoded(decoded){
  if (!decoded || !decoded.uid) throw new Error('Invalid decoded token')
  const email = decoded.email || ''
  const allowed = process.env.ALLOWED_EMAIL_DOMAIN || ''
  // allow multiple comma separated domains
  const allowedDomains = allowed.split(',').map(s => s.trim()).filter(Boolean)

  // If allowedDomains set, enforce the domain
  if (allowedDomains.length){
    const isAllowed = allowedDomains.some(domain => email.endsWith(domain))
    if (!isAllowed) {
      const err = new Error('Email domain not allowed')
      err.code = 'DOMAIN_NOT_ALLOWED'
      throw err
    }
  }

  let user = await User.findOne({ firebaseUid: decoded.uid })
  if (!user) {
    user = await User.create({ firebaseUid: decoded.uid, email: decoded.email, name: decoded.name || '', verified: true })
  } else {
    // keep name/email in sync if changed
    let changed = false
    if (user.email !== decoded.email){ user.email = decoded.email; changed = true }
    if (decoded.name && user.name !== decoded.name){ user.name = decoded.name; changed = true }
    if (changed) await user.save()
  }
  return user
}

// Express middleware: verify bearer token and attach firebase decoded token to req.firebaseUser
async function verifyToken(req, res, next){
  const authHeader = req.headers.authorization || ''
  const token = authHeader.split(' ')[1]
  if (!token) return res.status(401).json({ message: 'Missing auth token' })

  initFirebaseAdmin()
  if (!admin.apps || !admin.apps.length) return res.status(500).json({ message: 'Firebase admin not configured' })

  try {
    const decoded = await admin.auth().verifyIdToken(token)
    req.firebaseUser = decoded
    // Attach a DB user if available (do NOT auto-create here to keep verify endpoint explicit)
    const user = await User.findOne({ firebaseUid: decoded.uid })
    if (user) req.user = user
    next()
  } catch (err){
    console.error('Token verification error:', err.message)
    return res.status(401).json({ message: 'Invalid auth token' })
  }
}

module.exports = { verifyToken, getOrCreateUserFromDecoded }
