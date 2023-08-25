import { useLayoutEffect, useState } from 'react'
import { PageContext } from '../../lib/context'
import { DashboardView } from './view'
import { getPermission, getProjects } from '../../lib/api'
import { message } from 'antd'
import { useNavigate } from 'react-router-dom'


import io from "socket.io-client";
import { auth } from '../../lib/services'
//Need to add this before the component decleration
const socket = io(`${import.meta.env.VITE_API_URL}`,{
         transports: ["websocket"] });

export const Dashboard = () => {
    const [loader, setLoader] = useState(true)
    const [messageAPI, contextHolder] = message.useMessage()
    const [projects, setProjects] = useState([])
    const [order, setOrder] = useState(false)
    const [query, saveQuery] = useState("")
    const navigate = useNavigate()

    const toggleOrder = async () => {
        setOrder(!order)
        await fetchProjects()
    }

    const getUserPermission = async(projectId) => {
        try {
            const payload = {
              projectId: projectId
            }
            return await getPermission(payload)
        } catch (error) {
        //   showMessage('warning', 'ERROR DIDI')
          return error
        }
    }   
    
    const onSearch = async (e) => {
        saveQuery({
            name : {
                contains: e.target.value
            }
        })
        await fetchProjects()
    };
    
    const fetchProjects = async () => setTimeout(async () => {
        try {  
            //Fetch User Project and other project whome the user is associated to
            const payload = {
                 ...query,
                 order: {
                     name: order ? 'asc' : 'desc'
                 },
                 limit: 6,
                 start: 0
             }
            const response = await getProjects(payload)
            setProjects(response.data?.data)
            
        } catch (error) {
            showMessage('warning', "Server Error")
        }
    }, 1000)

    const showMessage = (type, content) => {
        messageAPI.open({
          type,
          content,
        })
    }

    useLayoutEffect(() => {
        //This will allow the page to load faster when first called
        const initProject = async() => {
            try {  
                //Fetch User Project and other project whome the user is associated to
                const payload = {
                     order: {
                         name: order ? 'asc' : 'desc'
                     },
                     limit: 6,
                     start: 0
                 }
                const response = await getProjects(payload)
                setProjects(response.data?.data)
                //Emit the project ids
                const handleEmitUser = async () => {
                    socket.emit('login', 
                        {
                            projectIds: response.data?.data.map(project => (project.id)),
                            userId: auth.getUserInfo().id
                        }
                    )
                }
                handleEmitUser()
                socket.off('login', handleEmitUser)
            } catch (error) {
                showMessage('warning', "Server Error")
            }
        }
        initProject()
        setLoader(false)

        //Emit the project ids
        const handleLogoutUser = async () => {
            await initProject()
        }
        socket.on('removeUser', handleLogoutUser)
        socket.off('removeUser', handleLogoutUser)
    }, [])

    const values = {
        navigate,
        onSearch,
        loader,
        contextHolder,
        projects,
        getUserPermission,
        toggleOrder,
        order
    }
    return (
        <PageContext.Provider value={values}>
            <DashboardView />
        </PageContext.Provider>
    )
}