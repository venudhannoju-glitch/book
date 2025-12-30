const express = require('express')
const router = express.Router()
const { verifyToken } = require('../middleware/auth')
const { ensureAppUser, isAdmin } = require('../middleware/authorize')
const adminController = require('../controllers/adminController')

// Only admins may verify listings
router.get('/listings', verifyToken, ensureAppUser, isAdmin, adminController.listPendingListings)
router.patch('/listings/:id/verify', verifyToken, ensureAppUser, isAdmin, adminController.verifyListing)
router.patch('/listings/:id/remove', verifyToken, ensureAppUser, isAdmin, adminController.removeListing)

// Users
router.get('/users', verifyToken, ensureAppUser, isAdmin, adminController.listUsers)
router.patch('/users/:id/role', verifyToken, ensureAppUser, isAdmin, adminController.updateUserRole)

module.exports = router
