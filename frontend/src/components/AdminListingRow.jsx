import React from 'react'

export default function AdminListingRow({listing, onVerify, onRemove}){
  return (
    <div className="bg-white p-4 rounded shadow flex items-start gap-4">
      <div className="w-28 h-20 bg-slate-100 flex items-center justify-center">
        {listing.images && listing.images.length ? (
          <img src={listing.images[0]} className="object-cover w-full h-full" alt="" />
        ) : (
          <div className="text-slate-400">No image</div>
        )}
      </div>
      <div className="flex-1">
        <div className="flex justify-between items-start">
          <div>
            <div className="font-semibold">{listing.title}</div>
            <div className="text-sm text-slate-500">{listing.author} • {listing.edition}</div>
            <div className="text-xs text-slate-400">{listing.courseCode} • {listing.syllabusYear}</div>
            <div className="text-xs text-slate-400">Seller: {listing.seller?.name || listing.seller?.email || '—'}</div>
          </div>
          <div className="text-lg font-bold">₹{listing.price}</div>
        </div>
        <div className="mt-3 flex gap-2">
          <button onClick={() => onVerify(listing._id)} className="bg-green-600 text-white px-3 py-1 rounded">Verify</button>
          <button onClick={() => onRemove(listing._id)} className="bg-red-600 text-white px-3 py-1 rounded">Remove</button>
        </div>
      </div>
    </div>
  )
}