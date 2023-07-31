import { NavLink, useRouteError } from "react-router-dom"

export const Error = () => {
    const error = useRouteError()
  return (
    <div>Error {error.message}
    <p>Go to <NavLink to={"/dashboard"}>Dashboard</NavLink></p>
    </div>
  )
}
