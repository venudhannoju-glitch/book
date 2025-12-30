import React from 'react'

export default function AdminUserRow({user, onPromote, onDemote}){
  return (
    <div className="bg-white p-4 rounded shadow flex items-center justify-between">
      <div>
        <div className="font-semibold">{user.name || user.email}</div>
        <div className="text-sm text-slate-500">{user.email} • role: {user.role}</div>
      </div>
      <div className="flex gap-2">
        {user.role !== 'admin' ? (
          <button onClick={() => onPromote(user._id)} className="bg-blue-600 text-white px-3 py-1 rounded">Promote to admin</button>
        ) : (
          <button onClick={() => onDemote(user._id)} className="bg-slate-200 px-3 py-1 rounded">Demote to student</button>
        )}
      </div>
    </div>
  )
}