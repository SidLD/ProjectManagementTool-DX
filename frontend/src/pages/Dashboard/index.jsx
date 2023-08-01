import { useLayoutEffect, useState } from 'react'
import { PageContext } from '../../lib/context'
import { DashboardView } from './view'
import { getPermission, getProjects } from '../../lib/api'
import { message } from 'antd'
import { useNavigate } from 'react-router-dom'

export const Dashboard = () => {
    const [loader, setLoader] = useState(true)
    const [messageAPI, contextHolder] = message.useMessage()
    const [projects, setProjects] = useState([])
    const onSearch = (value) => console.log(value);
    const navigate = useNavigate()
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
    const fetchProjects = async () => {
        try {   
            const response = await getProjects({})
            setProjects(response.data?.data)
        } catch (error) {
            showMessage('warning', "Server Error")
        }
    }
    const showMessage = (type, content) => {
        messageAPI.open({
          type,
          content,
        })
      }
    useLayoutEffect(() => {
        fetchProjects()
        setLoader(false)
    }, [])

    const values = {
        navigate,
        onSearch,
        loader,
        contextHolder,
        projects,
        getUserPermission
    }
    return (
        <PageContext.Provider value={values}>
            <DashboardView />
        </PageContext.Provider>
    )
}