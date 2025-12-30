import React from 'react'
import { Link } from 'react-router-dom'

export default function ListingCard({listing}){
  const img = (listing.images && listing.images.length) ? listing.images[0] : null
  return (
    <article className="bg-white rounded shadow-card hover:shadow-lg transition-shadow overflow-hidden flex flex-col">
      <div className="h-44 md:h-48 bg-slate-100 flex items-center justify-center">
        {img ? (
          <img src={img} alt={listing.title} className="object-cover w-full h-full" />
        ) : (
          <div className="text-slate-400">No image</div>
        )}
      </div>
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="font-semibold text-sm md:text-base truncate">{listing.title}</h3>
          <p className="text-sm text-slate-600 truncate">{listing.author} • {listing.edition || '—'} edition</p>
          <p className="text-xs text-slate-500 mt-1 truncate">{listing.courseCode ? `Course: ${listing.courseCode}` : ''} {listing.syllabusYear ? `• Syllabus: ${listing.syllabusYear}` : ''}</p>
        </div>
        <div className="mt-3 flex items-center justify-between">
          <div className="text-lg md:text-xl font-bold">₹{listing.price}</div>
          <Link to={`/listing/${listing._id}`} className="text-sm text-blue-600">View</Link>
        </div>
      </div>
    </article>
  )
}