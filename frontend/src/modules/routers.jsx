import {createBrowserRouter, createRoutesFromElements, Navigate, Route} from "react-router-dom"
import { Dashboard } from "../pages/Dashboard/index.jsx"
import { Login } from "../pages/Login/index.jsx"
import { Logout } from "../pages/Logout/index.jsx"
import { Project } from "../pages/Project/index.jsx"
import { PrivateLayout, PublicLayout } from "./module.jsx"
import { Setting } from "../pages/Setting/index.jsx"
import { Task } from "../pages/Task/index.jsx"
import { Error } from "../pages/Error/index.jsx"
import { TaskDetail } from "../pages/Task/TaskDetail/index.jsx"
const routers = createBrowserRouter(
    createRoutesFromElements(
        <>
            <Route element={<PublicLayout/>}>
                <Route path="/login" element={<Login/>}/>
                <Route  path="*" element={<Navigate to="/login" replace />} />

            </Route>  
            <Route element={<PrivateLayout/>} errorElement={<Error />}>
                <Route  index path="/dashboard" element={<Dashboard/>} />
                <Route  path="/project/:projectId" element={<Project/>} />
                <Route  path="/project/:projectId/tasks/:taskId" element={<TaskDetail />} /> 
                <Route  path="/tasks" element={<Task />} />
                <Route  path="/setting" element={<Setting/>} />
                <Route  path="/logout" element={<Logout/>} />
                <Route  path="*" element={<Navigate to="/dashboard" replace />} />
            </Route> 
        </>
    )
)
export default routers