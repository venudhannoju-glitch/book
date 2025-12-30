import api from './api'

const USER_KEY = 'campusbooks_user'
const TOKEN_KEY = 'campusbooks_token'

export function setUser(user){
  localStorage.setItem(USER_KEY, JSON.stringify(user))
}
export function getUser(){
  try { return JSON.parse(localStorage.getItem(USER_KEY)) } catch (e){ return null }
}
export function clearUser(){ localStorage.removeItem(USER_KEY); localStorage.removeItem(TOKEN_KEY); }

export function setToken(token){
  localStorage.setItem(TOKEN_KEY, token)
  // set default header for axios
  try { import('./api').then(m => m.default.defaults.headers.common['Authorization'] = `Bearer ${token}`) } catch(e){}
}
export function getToken(){ return localStorage.getItem(TOKEN_KEY) }

// Send Firebase ID token to backend and get/create user
export async function verifyTokenWithBackend(idToken){
  const res = await api.post('/auth/verify', null, { headers: { Authorization: `Bearer ${idToken}` } })
  if (res.data && res.data.user){
    setUser(res.data.user)
    setToken(idToken)
    return res.data.user
  }
  return null
}