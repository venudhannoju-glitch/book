import React, { useState, useEffect } from 'react'
import useDebouncedValue from '../hooks/useDebouncedValue'
export default function SearchFilters({ onSearch }){
  const [q, setQ] = useState('')
  const debouncedQ = useDebouncedValue(q, 350)
  const [courseCode, setCourseCode] = useState('')
  const [edition, setEdition] = useState('')
  const [minPrice, setMinPrice] = useState('')
  const [maxPrice, setMaxPrice] = useState('')
  const [syllabusYear, setSyllabusYear] = useState('')

  useEffect(() => {
    // auto-search when q changes (debounced)
    onSearch({ q: debouncedQ, courseCode, edition, minPrice, maxPrice, syllabusYear })
  }, [debouncedQ])

  function submit(e){
    e.preventDefault()
    onSearch({ q, courseCode, edition, minPrice, maxPrice, syllabusYear })
  }

  return (
    <form onSubmit={submit} className="bg-white p-4 rounded mb-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <input placeholder="Search title, author, course" value={q} onChange={e => setQ(e.target.value)} className="border rounded p-2" />
        <input placeholder="Course code" value={courseCode} onChange={e => setCourseCode(e.target.value)} className="border rounded p-2" />
        <input placeholder="Edition" value={edition} onChange={e => setEdition(e.target.value)} className="border rounded p-2" />
        <input placeholder="Syllabus year" value={syllabusYear} onChange={e => setSyllabusYear(e.target.value)} className="border rounded p-2" />
        <input placeholder="Min price" value={minPrice} onChange={e => setMinPrice(e.target.value)} className="border rounded p-2" />
        <input placeholder="Max price" value={maxPrice} onChange={e => setMaxPrice(e.target.value)} className="border rounded p-2" />
        <div className="flex items-center">
          <button className="bg-blue-600 text-white px-4 py-2 rounded mr-2">Search</button>
          <button type="button" onClick={() => { setQ(''); setCourseCode(''); setEdition(''); setMinPrice(''); setMaxPrice(''); setSyllabusYear('') }} className="px-3 py-2 border rounded">Reset</button>
        </div>
      </div>
    </form>
  )
}