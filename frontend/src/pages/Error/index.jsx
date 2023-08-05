import { NavLink, useRouteError } from "react-router-dom"

export const Error = () => {
    const error = useRouteError()
  return (
    <div className="text-center h-screen w-screen flex justify-center items-center ">
      Error {error.message}
      <p className="text-lg font-poppins bg-blue-500 w-fit p-2 rounded-lg mx-2">Go to 
          <span className="ml-2 hover:text-2xl delay-200">
            <NavLink to={"/dashboard"}>Dashboard</NavLink>
          </span>
        </p>
    </div>
  )
}
