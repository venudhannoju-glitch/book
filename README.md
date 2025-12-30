# CampusBooks

CampusBooks — an intra-college second-hand book marketplace (MVP scaffolding)

Tech stack (MVP):
- Frontend: React (Vite) + Tailwind CSS
- Backend: Node.js + Express
- Database: MongoDB (Atlas)
- Auth: Firebase Authentication (college-domain restriction)
- Realtime: Socket.io
- Image store: Cloudinary

Quick start (local):
1. Clone or open this repo.
2. Backend:
   - cd backend
   - copy `.env.example` to `.env` and fill values (MONGO_URI, PORT, etc.)
   - npm install
   - npm run dev
3. Frontend:
   - cd frontend
   - copy `.env.example` to `.env` and fill values (VITE_FIREBASE_API_KEY, etc.)
   - npm install
   - npm run dev

Notes:
- Firebase setup: create a project and enable Email/Password sign-in + restrict sign-in to your college domain using users' email domains (do not allow public signups). 
- Use MongoDB Atlas for the database. Fill MONGO_URI in backend `.env`.
- Cloudinary account for image uploads; set CLOUDINARY_URL in backend `.env`.

Next steps:
- Install dependencies for backend and frontend
- Implement authentication (Firebase) and protected routes
- Build listing CRUD and cloud image uploads
- Add Socket.io based chat and admin moderation

If you'd like, I can continue and run through the exact commands to install packages and implement the next task (Frontend skeleton).