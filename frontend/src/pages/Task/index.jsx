import { useEffect, useState } from 'react'
import { PageContext } from '../../lib/context'
import { TaskView } from './view'
import { useNavigate } from 'react-router-dom'
import { getAllTasks, updateTask } from '../../lib/api'
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
    const fetchTasks = async () => {
      try {
        const response = await getAllTasks({})
        setTasks(response.data?.data)
      } catch (error) {
        console.log(error) 
        showMessage('warning', 'Something Went Wrong')
      }
    }
    const handleStatusChange = async (task, updateTo) => {
      try {
        const response = await updateTask(task.project.id, task.id, {status:updateTo})
        if(response.data.ok){
          showMessage('success', `Set Status to ${updateTo}`)
          await fetchTasks()
        }else{
          showMessage('warning', response.data.message)
        }
      } catch (error) {
        console.log(error)
        showMessage('warning', error.response.data.message)
      }
    }
    useEffect(() => {
      fetchTasks()
      setLoader(false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[])
    const values = {
        loader,
        contextHolder,
        tasks,
        navigate,
        handleStatusChange
    }
  return (
      <PageContext.Provider value={values}>
        <TaskView />
      </PageContext.Provider>
  )
}
