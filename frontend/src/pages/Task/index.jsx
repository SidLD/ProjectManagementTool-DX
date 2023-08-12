import { useEffect, useState } from 'react'
import { PageContext } from '../../lib/context'
import { TaskView } from './view'
import { useNavigate } from 'react-router-dom'
import { getAllTasks, updateTask } from '../../lib/api'
import { message } from 'antd'
 
export const Task = () => {
    const [loader, setLoader] = useState(true)
    const navigate = useNavigate()
    const [messageAPI, contextHolder] = message.useMessage()
    const [dropStatus, setDropStatus] = useState(null)  //This state helps to render task list when succesfully droped on the other side
    const showMessage = (type, content) => {
      messageAPI.open({
        type,
        content
      })
    }
    const renderData = () => {

    }
    const fetchTasks = async (data) => {
      try {
        const payload = {
          ...data,
        }
        const response = await getAllTasks(payload)
        return response.data.data
      } catch (error) {
        console.log(error)
        return []
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
      fetchTasks(0,{startDate: 'asc'},{})
      setLoader(false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[])
    const values = {
        loader,
        contextHolder,
        navigate,
        handleStatusChange,
        fetchList: fetchTasks,
        updateData: renderData,
        dropStatus, 
        setDropStatus,
        showMessage
    }
  return (
      <PageContext.Provider value={values}>
        <TaskView />
      </PageContext.Provider>
  )
}
