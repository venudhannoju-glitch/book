import React, { useEffect, useState } from 'react'
import AdminListingRow from '../components/AdminListingRow'
import AdminUserRow from '../components/AdminUserRow'
import api from '../lib/api'
import { getUser } from '../lib/authClient'

export default function Admin(){
  const user = getUser()
  const [listings, setListings] = useState([])
  const [users, setUsers] = useState([])
  const [loadingListings, setLoadingListings] = useState(false)
  const [loadingUsers, setLoadingUsers] = useState(false)

  useEffect(() => { loadListings(); loadUsers() }, [])

  async function loadListings(){
    setLoadingListings(true)
    try{
      const res = await api.get('/admin/listings')
      setListings(res.data.listings || [])
    } catch (err){ console.error(err) } finally { setLoadingListings(false) }
  }

  async function verify(id){
    if (!confirm('Verify this listing?')) return
    try{
      await api.patch(`/admin/listings/${id}/verify`)
      setListings(prev => prev.filter(l => l._id !== id))
      alert('Verified')
    } catch (err){ alert('Failed: ' + err.message) }
  }

  async function removeListing(id){
    if (!confirm('Remove this listing?')) return
    try{
      await api.patch(`/admin/listings/${id}/remove`)
      setListings(prev => prev.filter(l => l._id !== id))
      alert('Removed')
    } catch (err){ alert('Failed: ' + err.message) }
  }

  async function loadUsers(){
    setLoadingUsers(true)
    try{
      const res = await api.get('/admin/users')
      setUsers(res.data.users || [])
    } catch (err){ console.error(err) } finally { setLoadingUsers(false) }
  }

  async function promote(id){
    if (!confirm('Promote user to admin?')) return
    try{
      await api.patch(`/admin/users/${id}/role`, { role: 'admin' })
      loadUsers()
      alert('Promoted')
    } catch (err){ alert('Failed: ' + err.message) }
  }

  async function demote(id){
    if (!confirm('Demote user to student?')) return
    try{
      await api.patch(`/admin/users/${id}/role`, { role: 'student' })
      loadUsers()
      alert('Demoted')
    } catch (err){ alert('Failed: ' + err.message) }
  }

  if (!user || user.role !== 'admin'){
    return <div className="container py-6">Unauthorized</div>
  }

  return (
    <section className="container py-6">
      <h1 className="text-2xl font-semibold mb-4">Admin Panel</h1>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-3">Pending Listings</h2>
        {loadingListings ? (<div>Loading…</div>) : (
          <div className="space-y-4">
            {listings.map(l => <AdminListingRow key={l._id} listing={l} onVerify={verify} onRemove={removeListing} />)}
            {!listings.length && <div className="text-sm text-slate-500">No pending listings</div>}
          </div>
        )}
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-3">Users</h2>
        {loadingUsers ? (<div>Loading…</div>) : (
          <div className="space-y-4">
            {users.map(u => <AdminUserRow key={u._id} user={u} onPromote={promote} onDemote={demote} />)}
          </div>
        )}
      </div>
    </section>
  )
}