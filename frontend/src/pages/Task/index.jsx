import { useEffect, useState } from 'react'
import { PageContext } from '../../lib/context'
import { TaskView } from './view'
import { useNavigate } from 'react-router-dom'
import { getAllTasks } from '../../lib/api'
import { message } from 'antd'
 
export const Task = () => {
    const [tasks, setTasks] = useState([])
    const [loader, setLoader] = useState(true)
    const navigate = useNavigate()
    const [messageAPI, contextHolder] = message.useMessage()
    const showMessage = (type, content) => {
      messageAPI.open({
        type,
        content
      })
    }
    // const handleDrag = (e: React.DragEvent, widgetType: string) => {
    //     e.dataTransfer.setData("widgetType", widgetType)
    // }
    //Start of Single Task Functions
    const fetchTasks = async () => {
      try {
        const response = await getAllTasks({status:"COMPLETED"})
        setTasks(response.data?.data)
      } catch (error) {
        console.log(error) 
        showMessage('warning', 'Something Went Wrong')
      }
    }
    //END of Single Task Functions
    useEffect(() => {
      fetchTasks()
      setLoader(false)
    },[])
    const values = {
        loader,
        contextHolder,
        tasks,
        navigate
    }
  return (
      <PageContext.Provider value={values}>
        <TaskView />
      </PageContext.Provider>
  )
}
