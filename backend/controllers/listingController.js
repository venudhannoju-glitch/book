const Listing = require('../models/Listing')

exports.listListings = async (req, res) => {
  try {
    const {
      q,
      courseCode,
      syllabusYear,
      edition,
      minPrice,
      maxPrice,
      condition,
      page = 1,
      limit = 20,
      sort = 'createdAt:desc'
    } = req.query

    const filter = { status: 'active' }
    if (courseCode) filter.courseCode = courseCode
    if (syllabusYear) filter.syllabusYear = Number(syllabusYear)
    if (edition) filter.edition = edition
    if (condition) filter.condition = Number(condition)

    if (minPrice || maxPrice){
      filter.price = {}
      if (minPrice) filter.price.$gte = Number(minPrice)
      if (maxPrice) filter.price.$lte = Number(maxPrice)
    }

    if (q) filter.$text = { $search: q }

    // Pagination & sorting
    const pageNum = Math.max(1, Number(page))
    const perPage = Math.max(1, Math.min(100, Number(limit)))

    let sortObj = { createdAt: -1 }
    if (sort){
      const [field, dir] = sort.split(':')
      sortObj = { [field]: (dir === 'asc' ? 1 : -1) }
    }

    const total = await Listing.countDocuments(filter)
    const listings = await Listing.find(filter)
      .populate('seller', 'name email')
      .sort(sortObj)
      .skip((pageNum - 1) * perPage)
      .limit(perPage)

    res.json({ listings, total, page: pageNum, perPage })
  } catch (err){
    console.error(err)
    res.status(500).json({ message: 'Server error' })
  }
}

exports.getListing = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id).populate('seller', 'name email')
    if (!listing) return res.status(404).json({ message: 'Listing not found' })
    res.json({ listing })
  } catch (err){
    console.error(err)
    res.status(500).json({ message: 'Server error' })
  }
}

exports.createListing = async (req, res) => {
  try {
    // Ensure firebase decoded token is present
    const decoded = req.firebaseUser
    if (!decoded) return res.status(401).json({ message: 'Unauthorized' })

    // Map or create app user
    const { getOrCreateUserFromDecoded } = require('../middleware/auth')
    const user = await getOrCreateUserFromDecoded(decoded)

    // Compose payload
    const payload = {
      title: req.body.title,
      author: req.body.author,
      edition: req.body.edition,
      price: Number(req.body.price || 0),
      courseCode: req.body.courseCode || null,
      syllabusYear: req.body.syllabusYear ? Number(req.body.syllabusYear) : null,
      condition: req.body.condition ? Number(req.body.condition) : null,
      location: req.body.location || null,
      seller: user._id
    }

    // Handle image uploads if present (req.files)
    if (req.files && req.files.length){
      const { uploadBuffer } = require('../config/cloudinary')
      const uploads = []
      for (const file of req.files){
        const uploaded = await uploadBuffer(file.buffer, file.originalname, 'campusbooks/listings')
        if (uploaded && uploaded.secure_url) uploads.push(uploaded.secure_url)
      }
      payload.images = uploads
    }

    const listing = await Listing.create(payload)
    res.status(201).json({ listing })
  } catch (err){
    console.error('createListing error:', err)
    res.status(400).json({ message: err.message || 'Invalid data' })
  }
}

exports.updateListing = async (req, res) => {
  try {
    // Expect isOwnerOrAdmin middleware to have set req.listing
    const listing = req.listing || await Listing.findById(req.params.id)
    if (!listing) return res.status(404).json({ message: 'Listing not found' })

    // Update fields
    const fields = ['title','author','edition','price','courseCode','syllabusYear','condition','location','status']
    fields.forEach(f => { if (req.body[f] !== undefined) listing[f] = req.body[f] })

    // Handle new images appended
    if (req.files && req.files.length){
      const { uploadBuffer } = require('../config/cloudinary')
      for (const file of req.files){
        const uploaded = await uploadBuffer(file.buffer, file.originalname, 'campusbooks/listings')
        if (uploaded && uploaded.secure_url) listing.images.push(uploaded.secure_url)
      }
    }

    await listing.save()
    res.json({ listing })
  } catch (err){
    console.error(err)
    res.status(400).json({ message: 'Invalid data' })
  }
}

exports.deleteListing = async (req, res) => {
  try {
    const listing = await Listing.findByIdAndUpdate(req.params.id, { status: 'removed' }, { new: true })
    if (!listing) return res.status(404).json({ message: 'Listing not found' })
    res.json({ listing })
  } catch (err){
    console.error(err)
    res.status(500).json({ message: 'Server error' })
  }
}
