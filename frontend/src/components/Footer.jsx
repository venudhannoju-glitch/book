import React from 'react'

export default function Footer(){
  return (
    <footer className="bg-transparent py-8">
      <div className="container px-6 text-center text-sm text-slate-500">
        © {new Date().getFullYear()} CampusBooks — Intra-college second-hand book marketplace.
      </div>
    </footer>
  )
}