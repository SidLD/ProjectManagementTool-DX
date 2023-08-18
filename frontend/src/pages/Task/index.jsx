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
    const [taskList, setTaskList] = useState([
      {
        title: 'TO DO',
        tasks: []
      },
      {
        title: 'IN PROGRESS',
        tasks: []
      },
      {
        title: 'COMPLETED',
        tasks: []
      }
    ])

    const fetchTasks = async (start, order, query) => {
      try {
        const result = await Promise.all(taskList.map(async (list) => {
          const payload = {
            OR: [
              {task: {contains: query}},
              {task_member: {
                some: {
                  role: { 
                     name: query
                  }
                }
              }},
              {project: {
                name: {contains: query}
              }}
            ],
            order: order,
            status: list.title
          }
          try {
            const response = await getAllTasks(payload)
            return {
              title: list.title,
              tasks: response.data.data
            }
          } catch (error) {
            return {
              ...list,
            }  
          }
        }))
        setTaskList(result)
      } catch (error) {
        console.log(error)
      }
    }

    const showMessage = (type, content) => {
      messageAPI.open({
        type,
        content
      })
    }
    
    const handleStatusChange = async (projectId ,taskId, status) => {
      try {
        const payload = {
          status: status
        }
        const response = await updateTask(projectId, taskId, payload)
        if(response.data.ok){
          showMessage('success', `Set Status to ${status}`)
          return true
        }
      } catch (error) {
        showMessage('warning', error.response.data.message)
        return false
      }
    }

  //if destination is null === DId not drop in any droppable Column
  //if Destination index == source index === drop on the same column
  //Lastly get all the data 
    const onDragEnd = async (e) => {
      const {destination, source, draggableId} = e
      if (!destination) return;
      if(destination.droppableId === source.droppableId) return;
      
      let sourceColumn = taskList.find(item => item.title === source.droppableId)
      const selectedTask = sourceColumn.tasks.find(temp => temp.id === draggableId)
      let destinationColumn = taskList.find(temp => temp.title === destination.droppableId)
      
      destinationColumn.tasks.push(selectedTask)
      sourceColumn.tasks.splice(selectedTask, 1)
      
      if(handleStatusChange(selectedTask.project.id ,selectedTask.id, destinationColumn.title)){
        setTaskList(taskList => taskList.map(column => {
          if(column.title === sourceColumn.title){
            return sourceColumn
          }
          else if(column.title === destinationColumn.title){
            return destinationColumn
          }
          else{
            return column
          }
        }))
      }
  }
   
    useEffect(() => {
      fetchTasks(0,{startDate: 'asc'},{})
      setLoader(false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[])

    const values = {
      fetchTasks,
      onDragEnd,
      loader,
      contextHolder,
      navigate,
      handleStatusChange,
      dropStatus, 
      setDropStatus,
      showMessage,
      taskList
    }

  return (
      <PageContext.Provider value={values}>
        <TaskView />
      </PageContext.Provider>
  )
}
