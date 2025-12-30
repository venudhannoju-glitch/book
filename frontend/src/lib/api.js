import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000',
  headers: { 'Content-Type': 'application/json' }
})

// attach token if present
try {
  const token = localStorage.getItem('campusbooks_token')
  if (token) api.defaults.headers.common['Authorization'] = `Bearer ${token}`
} catch (e){}

export default api
