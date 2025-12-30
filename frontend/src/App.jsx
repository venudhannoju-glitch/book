import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import Auth from './pages/Auth'
import Browse from './pages/Browse'
import Post from './pages/Post'
import Listing from './pages/Listing'
import Admin from './pages/Admin'
import AdminRoute from './components/AdminRoute'

export default function App(){
  return (
    <Routes>
      <Route path="/" element={<Layout/>}>
        <Route index element={<Home/>} />
        <Route path="browse" element={<Browse/>} />
        <Route path="post" element={<Post/>} />
        <Route path="listing/:id" element={<Listing/>} />
        <Route path="auth" element={<Auth/>} />
        <Route path="admin" element={<AdminRoute><Admin/></AdminRoute>} />
      </Route>
    </Routes>
  )
}
