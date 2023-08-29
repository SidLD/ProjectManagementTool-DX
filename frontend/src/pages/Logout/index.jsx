
import { useContext, useEffect } from 'react'
import { Navigate } from 'react-router-dom'
import { AppContext } from '../../lib/context'
  
export const Logout = () => {
    const {handleLogout} = useContext(AppContext)

    useEffect( () => {
      handleLogout()

    })
  return (
    <Navigate to={'/login'} replace />
  )
}