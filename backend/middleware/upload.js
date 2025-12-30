const multer = require('multer')

// store files in memory and upload to Cloudinary from memory
const storage = multer.memoryStorage()
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB per file
})

module.exports = upload
