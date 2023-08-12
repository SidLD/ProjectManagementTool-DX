import { useEffect } from 'react'
import { auth } from '../../lib/services.js'
import { io } from 'socket.io-client';
const socket = io(`${import.meta.env.VITE_API_URL}`,{
  transports: ["websocket"] });
export const Logout = () => {
    useEffect( () => {
        socket.emit('logout', auth.getUserInfo().id)
        auth.clear()
        window.location.href="/"
    })
  return (
    <></> 
  )
}