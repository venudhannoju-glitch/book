const cloudinary = require('cloudinary').v2

// Cloudinary will auto-configure from CLOUDINARY_URL env var if present
if (process.env.CLOUDINARY_URL) {
  cloudinary.config({ secure: true })
} else if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true
  })
} else {
  console.warn('Cloudinary not configured. Set CLOUDINARY_URL or CLOUDINARY_* env vars to enable image uploads.')
}

// Helper to upload a buffer (stream) and return secure_url
function uploadBuffer(buffer, filename, folder = 'campusbooks'){
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream({ folder }, (err, res) => {
      if (err) return reject(err)
      resolve(res)
    })
    stream.end(buffer)
  })
}

module.exports = { cloudinary, uploadBuffer }
