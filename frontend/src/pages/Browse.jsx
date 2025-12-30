import React, { useState, useEffect } from 'react'
import ListingCard from '../components/ListingCard'
import SearchFilters from '../components/SearchFilters'
import api from '../lib/api'

export default function Browse(){
  const [listings, setListings] = useState([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [perPage, setPerPage] = useState(12)
  const [loading, setLoading] = useState(false)
  const [filters, setFilters] = useState({})

  async function load(pageNum = 1, curFilters = filters){
    setLoading(true)
    try{
      const params = { page: pageNum, limit: perPage, ...curFilters }
      const res = await api.get('/listings', { params })
      setListings(res.data.listings || [])
      setTotal(res.data.total || 0)
      setPage(res.data.page || pageNum)
    } catch (err){
      console.error('Failed to load listings', err.message)
    } finally { setLoading(false) }
  }

  useEffect(() => { load(1) }, [perPage])

  function handleSearch(newFilters){
    setFilters(newFilters)
    load(1, newFilters)
  }

  return (
    <section className="container py-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Browse Books</h1>
        <div className="text-sm text-slate-600">{total} listings</div>
      </div>

      <SearchFilters onSearch={handleSearch} />

      {loading ? (
        <div className="text-center py-20">Loading…</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {listings.map(item => <ListingCard key={item._id} listing={item} />)}
        </div>
      )}

      <div className="mt-6 flex justify-center gap-3">
        {page > 1 && <button onClick={() => load(page - 1)} className="px-3 py-2 border rounded">Prev</button>}
        <div className="px-3 py-2 text-sm">Page {page}</div>
        {(page * perPage) < total && <button onClick={() => load(page + 1)} className="px-3 py-2 border rounded">Next</button>}
      </div>
    </section>
  )
}