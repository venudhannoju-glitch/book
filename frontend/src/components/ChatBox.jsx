import React, { useEffect, useState, useRef } from 'react'
import { io } from 'socket.io-client'
import api from '../lib/api'
import { getToken, getUser } from '../lib/authClient'

export default function ChatBox({ listingId }){
  const [messages, setMessages] = useState([])
  const [text, setText] = useState('')
  const socketRef = useRef(null)
  const user = getUser()

  useEffect(() => {
    // load history
    async function load(){
      try{
        const res = await api.get(`/chat/${listingId}`)
        setMessages(res.data.messages || [])
      } catch (err){
        console.error('Failed to load messages', err.message)
      }
    }
    load()

    // connect socket
    const url = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000'
    const socket = io(url, { auth: { token: getToken() } })
    socketRef.current = socket

    socket.on('connect', () => {
      socket.emit('join', listingId)
    })

    socket.on('chat:message', (payload) => {
      setMessages(prev => [...prev, { from: payload.from, to: payload.to, body: payload.body, createdAt: new Date().toISOString() }])
    })

    socket.on('chat:message:save', (msg) => {
      setMessages(prev => [...prev, msg])
    })

    return () => {
      socket.disconnect()
    }
  }, [listingId])

  async function send(){
    if (!text.trim()) return
    const payload = { listingId, from: user ? user._id : null, to: null, body: text }
    try{
      socketRef.current.emit('chat:message', payload)
      setText('')
    } catch (err){
      console.error('Send error', err)
    }
  }

  return (
    <div className="mt-6">
      <div className="bg-white p-4 rounded shadow max-w-2xl">
        <h3 className="font-semibold mb-2">Chat</h3>
        <div className="flex flex-col space-y-2 max-h-64 overflow-auto mb-3">
          {messages.map((m, i) => (
            <div key={i} className={`max-w-[80%] p-2 rounded ${m.from === user?._id ? 'bg-blue-50 self-end' : 'bg-slate-100 self-start'}`}>
              <div className="text-sm text-slate-700">{m.body}</div>
              <div className="text-xs text-slate-400 mt-1">{new Date(m.createdAt).toLocaleString()}</div>
            </div>
          ))}
        </div>

        <div className="flex gap-2">
          <input value={text} onChange={e => setText(e.target.value)} className="flex-1 border rounded p-2" placeholder="Type a message" />
          <button onClick={send} className="bg-blue-600 text-white px-4 py-2 rounded">Send</button>
        </div>
      </div>
    </div>
  )
}