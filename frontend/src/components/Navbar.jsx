import React, { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getUser, clearUser } from '../lib/authClient'
import { signOut } from '../lib/firebase'

export default function Navbar(){
  const [open, setOpen] = useState(false)
  const [user, setUser] = useState(null)
  const nav = useNavigate()
  const ref = useRef()

  useEffect(() => {
    try { setUser(getUser()) } catch (e){ setUser(null) }
  }, [])

  useEffect(() => {
    function onDoc(e){ if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('click', onDoc)
    return () => document.removeEventListener('click', onDoc)
  }, [])

  async function handleSignOut(){
    try{ await signOut(); clearUser(); setUser(null); nav('/'); } catch (e){ console.error(e) }
  }

  return (
    <header className="bg-white border-b">
      <div className="container px-4 md:px-6 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded flex items-center justify-center text-white font-bold">CB</div>
          <span className="font-semibold">CampusBooks</span>
        </Link>

        <nav className="hidden md:block">
          <ul className="flex gap-4 items-center text-sm">
            <li><Link to="/browse" className="text-slate-700 hover:text-blue-600">Browse</Link></li>
            <li><Link to="/post" className="text-slate-700 hover:text-blue-600">Post</Link></li>
            {user && user.role === 'admin' && (<li><Link to="/admin" className="text-slate-700 hover:text-blue-600">Admin</Link></li>)}
            {!user ? (
              <li><Link to="/auth" className="px-3 py-1 border rounded text-sm text-blue-600">Sign in</Link></li>
            ) : (
              <li className="flex items-center gap-3">
                <div className="text-sm text-slate-700">{user.name || user.email}</div>
                <button onClick={handleSignOut} className="px-3 py-1 border rounded text-sm">Sign out</button>
              </li>
            )}
          </ul>
        </nav>

        {/* Mobile */}
        <div className="md:hidden" ref={ref}>
          <button onClick={() => setOpen(!open)} aria-label="Toggle menu" className="p-2 rounded border">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d={open ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'} /></svg>
          </button>

          {open && (
            <div className="absolute right-4 mt-2 w-48 bg-white border rounded shadow-card py-2">
              <Link to="/browse" onClick={() => setOpen(false)} className="block px-3 py-2 text-sm text-slate-700">Browse</Link>
              <Link to="/post" onClick={() => setOpen(false)} className="block px-3 py-2 text-sm text-slate-700">Post</Link>
              {user && user.role === 'admin' && (<Link to="/admin" onClick={() => setOpen(false)} className="block px-3 py-2 text-sm text-slate-700">Admin</Link>)}
              {!user ? (
                <Link to="/auth" onClick={() => setOpen(false)} className="block px-3 py-2 text-sm text-blue-600">Sign in</Link>
              ) : (
                <button onClick={() => { handleSignOut(); setOpen(false) }} className="w-full text-left px-3 py-2 text-sm">Sign out</button>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  )
}