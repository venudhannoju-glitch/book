import React from 'react'

export default function Post(){
  return (
    <section className="container py-6">
      <h1 className="text-2xl font-semibold mb-4">Post a Book</h1>
      <form className="bg-white p-6 rounded shadow max-w-2xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <label className="block md:col-span-2">
            <div className="text-sm font-medium">Title</div>
            <input className="mt-1 w-full border rounded p-2" name="title" />
          </label>
          <label className="block">
            <div className="text-sm font-medium">Author</div>
            <input className="mt-1 w-full border rounded p-2" name="author" />
          </label>
          <label className="block">
            <div className="text-sm font-medium">Edition</div>
            <input className="mt-1 w-full border rounded p-2" name="edition" />
          </label>
          <label className="block">
            <div className="text-sm font-medium">Price (₹)</div>
            <input type="number" className="mt-1 w-full border rounded p-2" name="price" />
          </label>
          <label className="block">
            <div className="text-sm font-medium">Course Code</div>
            <input className="mt-1 w-full border rounded p-2" name="courseCode" />
          </label>
          <label className="block">
            <div className="text-sm font-medium">Syllabus Year</div>
            <input type="number" className="mt-1 w-full border rounded p-2" name="syllabusYear" />
          </label>
          <label className="block">
            <div className="text-sm font-medium">Condition (1-5)</div>
            <select className="mt-1 w-full border rounded p-2" name="condition">
              <option value="5">5 - Like new</option>
              <option value="4">4 - Good</option>
              <option value="3">3 - Fair</option>
              <option value="2">2 - Worn</option>
              <option value="1">1 - Heavily used</option>
            </select>
          </label>
          <label className="block md:col-span-2">
            <div className="text-sm font-medium">Images</div>
            <input type="file" className="mt-1" multiple />
          </label>

          <div className="flex justify-end md:col-span-2">
            <button className="btn-primary">Post Listing</button>
          </div>
        </div>
      </form>
    </section>
  )
}