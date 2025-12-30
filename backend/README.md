# Backend (CampusBooks)

This backend is a scaffold for the CampusBooks marketplace.

Important files:
- `server.js` — Express server, routes mounted, Socket.io initialized
- `config/db.js` — MongoDB connection helper
- `models/` — Mongoose models (User, Listing, Message)
- `routes/` — API routes (auth, listings, chat, admin)
- `middleware/auth.js` — Firebase Admin token verification middleware

Environment variables
- `MONGO_URI` — MongoDB connection string
- `FIREBASE_SERVICE_ACCOUNT_JSON` — Firebase service account JSON string for admin SDK (or provide path with `FIREBASE_SERVICE_ACCOUNT_PATH`)
- `CLOUDINARY_URL` — Cloudinary upload URL

Run locally:
1. cd backend
2. npm install
3. Copy `.env.example` -> `.env` and set values
4. npm run dev

Next steps:
- Implemented Cloudinary upload handler for images (multer + cloudinary)
- Listing creation now maps Firebase UID to internal `User._id` via `getOrCreateUserFromDecoded` and saves the seller
- Implemented authorization checks: `ensureAppUser`, `isOwnerOrAdmin`, and `isAdmin` middlewares. Update/delete endpoints only allow owner or admin. 🔐
- Added basic rate-limiting via `express-rate-limit` for `/api/*` endpoints
- Persist chat messages on socket events to `Message` model (socket emits `chat:message:save` after save)
