// Firebase client stub — fill env vars in .env and implement auth flows
// See: https://firebase.google.com/docs/web/setup

import { initializeApp } from 'firebase/app'
import { getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
}

let app
let auth

export function initFirebase(){
  if (!app) app = initializeApp(firebaseConfig)
  if (!auth) auth = getAuth(app)
  return { app, auth }
}

export async function signInWithGoogle(){
  initFirebase()
  const provider = new GoogleAuthProvider()
  const credential = await signInWithPopup(auth, provider)
  const user = credential.user
  const idToken = await user.getIdToken()
  return { user, idToken }
}

export async function signOut(){
  initFirebase()
  if (auth && auth.signOut) return auth.signOut()
}
// Later: restrict domain using auth state and email domain checks or Firebase Authentication 'allow' settings.
