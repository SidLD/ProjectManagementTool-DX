import { useEffect } from 'react'
import { auth } from '../../lib/services.js'
import { io } from 'socket.io-client';
import { getProjects } from '../../lib/api.js';
const socket = io(`${import.meta.env.VITE_API_URL}`,{
  transports: ["websocket"] });
export const Logout = () => {
    useEffect( () => {
      const getProjectsAndEmit = async() => {
        try {  
            //Fetch User Project and other project whome the user is associated to
            const payload = {
                 limit: 6,
                 start: 0
             }
            const response = await getProjects(payload)
            //Emit the project ids
            const handleEmitUser = async () => {
                socket.emit('logout', 
                    {
                        projectIds: response.data?.data.map(project => (project.id)),
                        userId: auth.getUserInfo().id
                    }
                )
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