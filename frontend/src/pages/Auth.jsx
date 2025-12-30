import React from 'react'
import { useNavigate } from 'react-router-dom'
import { signInWithGoogle } from '../lib/firebase'
import { verifyTokenWithBackend, setUser } from '../lib/authClient'

export default function Auth(){
  const nav = useNavigate()

  async function handleGoogle(){
    try {
      const { user, idToken } = await signInWithGoogle()
      const appUser = await verifyTokenWithBackend(idToken)
      if (appUser) {
        // Redirect home
        nav('/')
      } else {
        // Domain may be blocked
        alert('Sign-in failed. Please use your college email.')
      }
    } catch (err){
      console.error(err)
      alert('Sign-in failed: ' + (err.message || ''))
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="max-w-md w-full bg-white p-6 rounded shadow">
        <h2 className="text-xl font-semibold mb-4">Sign in</h2>
        <p className="text-sm text-slate-600 mb-4">Sign in using your college account (domain restricted after verifying with backend).</p>
        <button onClick={handleGoogle} className="w-full bg-white border rounded py-2 flex items-center justify-center gap-2">
          <img src="/google-logo.svg" alt="Google" className="w-5 h-5" />
          <span>Sign in with Google</span>
        </button>
      </div>
    </div>
  )
}
