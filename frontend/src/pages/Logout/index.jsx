import { useEffect } from 'react'
import { auth } from '../../lib/services.js'
export const Logout = () => {
    useEffect( () => {
        auth.clear()
        window.location.href="/"
    })
  return (
    <></>
  )
}