const express = require('express')
const router = express.Router()
const listingController = require('../controllers/listingController')
const { verifyToken } = require('../middleware/auth')
const upload = require('../middleware/upload')
const { ensureAppUser, isOwnerOrAdmin } = require('../middleware/authorize')

router.get('/', listingController.listListings)
router.get('/:id', listingController.getListing)
// Use multipart/form-data for file upload (images) — require app user
router.post('/', verifyToken, ensureAppUser, upload.array('images', 6), listingController.createListing)
// Update / delete require owner or admin
router.put('/:id', verifyToken, ensureAppUser, isOwnerOrAdmin, upload.array('images', 6), listingController.updateListing)
router.delete('/:id', verifyToken, ensureAppUser, isOwnerOrAdmin, listingController.deleteListing)

module.exports = router
