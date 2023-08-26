import { useEffect } from 'react'
import { auth } from '../../lib/services.js'
import { io } from 'socket.io-client';

const socket = io(`${import.meta.env.VITE_API_URL}`,{
  transports: ["websocket"] });
  
export const Logout = () => {
    useEffect( () => {
      const getProjectsAndEmit = async() => {
        try {  
            //Emit the project ids
            const handleEmitUser = async () => {
                socket.emit('logout', auth.getUserInfo().id)
            }
            await handleEmitUser()
            socket.off('logout', handleEmitUser)  
            auth.clear()
            window.location.href="/"
        } catch (error) {
           console.log(error)
        }
      }
      getProjectsAndEmit()
    })
  return (
    <></> 
  )
}