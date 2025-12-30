import React from 'react'
import { useParams } from 'react-router-dom'
import ChatBox from '../components/ChatBox'
export default function Listing(){
  const { id } = useParams()
  // placeholder data or fetch from API in the future
  return (
    <section className="container py-6">
      <h1 className="text-2xl font-semibold mb-4">Listing #{id}</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded shadow">
          <p className="text-slate-600">Details will appear here for listing <strong>#{id}</strong>.</p>
          <div className="mt-4">
            <button className="bg-green-600 text-white px-4 py-2 rounded mr-2">Contact Seller (Chat)</button>
            <button className="bg-slate-200 px-4 py-2 rounded">Schedule Meet</button>
          </div>
        </div>

        <div>
          <ChatBox listingId={id} />
        </div>
      </div>
    </section>
  )
}