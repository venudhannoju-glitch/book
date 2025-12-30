require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const app = express();
app.use(cors());
app.use(express.json());

// Basic rate limiter
const rateLimit = require('express-rate-limit')
const apiLimiter = rateLimit({ windowMs: 60 * 1000, max: 60 }) // 60 reqs/min per IP
app.use('/api/', apiLimiter)

// Connect to MongoDB
connectDB();

// Health route
app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

// Mount API routes
app.use('/api/auth', require('./routes/auth'))
app.use('/api/listings', require('./routes/listings'))
app.use('/api/chat', require('./routes/chat'))
app.use('/api/admin', require('./routes/admin'))

// Create HTTP server and attach Socket.io for realtime chat
const http = require('http')
const server = http.createServer(app)
const { Server } = require('socket.io')
const io = new Server(server, { cors: { origin: '*' } })

io.on('connection', (socket) => {
  console.log('Socket connected', socket.id)

  // Join room for a listing chat
  socket.on('join', (room) => {
    socket.join(room)
  })

  socket.on('chat:message', async (payload) => {
    // payload: { listingId, from, to, body }
    io.to(payload.listingId).emit('chat:message', payload)
    // Persist message to DB for history
    try {
      const Message = require('./models/Message')
      const msg = await Message.create({ listing: payload.listingId, from: payload.from, to: payload.to, body: payload.body })
      // Optionally emit saved message with id/timestamp
      io.to(payload.listingId).emit('chat:message:save', msg)
    } catch (err){
      console.error('Failed to persist chat message:', err.message)
    }
  })

  socket.on('disconnect', () => {
    console.log('Socket disconnected', socket.id)
  })
})

const PORT = process.env.PORT || 5000
server.listen(PORT, () => console.log(`Server running on port ${PORT}`))
