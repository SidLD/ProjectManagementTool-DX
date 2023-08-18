/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react'
import { PageContext } from '../../lib/context'
import { ProjectView } from './view'
import { useNavigate, useParams } from 'react-router-dom'
import { message } from 'antd'
import moment from "moment";
import { 
  createTasks, 
  getAllPermission, 
  getPermission, 
  getProjects, 
  getRoles, 
  getTasks, 
  getTeamMembers, 
  updateTask} from '../../lib/api'
  import io from "socket.io-client";

  //Need to add this before the component decleration
  const socket = io(`${import.meta.env.VITE_API_URL}`,{
           transports: ["websocket"] });

export const Project = () => {
    const {projectId} = useParams()
    const [messageAPI, contextHolder] = message.useMessage()
    const [loader, setLoader] = useState(true)
    const [project, setProject] = useState({})
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
    const [userPermission, setPermission] = useState([])
    const navigate = useNavigate()
    const [roles, setRoles] = useState([])
    const [team, setTeam] = useState([])
    const [allPermission, setAllPermission] = useState([])
    const [query, setQuery] = useState("")

    const handleQueryChange = (e) => {
      setQuery(e)
    } 

    const fetchTasks = async (query) => {
      try {
        const result = await Promise.all(taskList.map(async (list) => {
          const payload = {
            OR: [
              {task: query},
              {task_member: {
                some: {
                  role: { name: query }
                }
              }},
              {project: {name: query}}
            ],
            status: list.title
          }
          try {
            const response = await getTasks(projectId, payload)
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

    const fetchTeam = async (data) => {
      try {
        const payload = {
          ...data,
          projectId, 
        }
        const response = await getTeamMembers(payload)
        setTeam(response.data.data)
      } catch (error) {
        console.log(error)
      }
    }

    const submitTask = async (e) => {
      try {
        const payload = {
            name: e.name,
            description: e.description,
            members: e?.selectedMemberForTask || [],
            startDate: new Date(e.startEndTime[0]),
            endDate: new Date(e.startEndTime[1])
        }
        const response = await createTasks(projectId, payload)
        if(response.data.ok){
          showMessage('success', 'Success')
          return true
        }
      } catch (error) {
        console.log(error)
        
        return false
      }
    }

    const fetchRoles = async (data) => {
      try {
        const payload = {
          ...data,
          projectId, 
        }
        const response = await getRoles(payload)    
        setRoles(response.data.data)
      } catch (error) {
        console.log(error)
      }
    }
    
    const fetchProject = async () => {
      try {
        const payload = {
          id: projectId
        }
        const response = await getProjects(payload)
        setProject(response.data?.data[0])
      } catch (error) {
        showMessage('warning', error.response.data.message)
        if(error.response.status === 403){
          showMessage('warning', "Navigating to Dashboard")
          setTimeout(() => {
            navigate("/dashboard")
          }, 1000)
        }
      }
    }
    
    const getUserPermission = async() => {
      try {
          const payload = {
            projectId: projectId
          }
          const response = await getPermission(payload)
          setPermission(response.data.data)
      } catch (error) {
        console.log(error)
        showMessage('warning', 'ERROR DIDI')
      }
    }

    //This Limit the task start time, since task should not have start time before the project start time
    const disabledDate = (current) => {
      let customDate = new Date(project.startDate);
      return current && current < moment(customDate, "YYYY-MM-DD");
    }
    
    const showMessage = (type, content) => {
      messageAPI.open({
        type,
        content,
      })
    }

    //Edit Role & Member Role Functions
    const fetchAllPermission = async () => {
      try {
        const response = await getAllPermission()
        setAllPermission(response.data.data)
      } catch (error) {
        setAllPermission([])
      }
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
      fetchProject("")
      getUserPermission()
      fetchRoles()
      fetchAllPermission()
      fetchTeam()
      fetchTasks()
      setLoader(false)
      socket.on('newUser', async () => {
        await fetchTeam()
      })
      socket.on('removeUser', async () => {
        await fetchTeam()
      })

    },[])

    //All data that requires the other component to render is passed here
    const values = {
      onDragEnd,
      fetchTeam,
      fetchList: fetchTasks,
      fetchRoles,
      showMessage,
      updateData: fetchProject,
      navigate,
      disabledDate,
      submitTask, 
      handleQueryChange,
      taskList,
      query,
      contextHolder,
      loader,
      userPermission,
      roles,
      team,
      projectId,
      project,
      allPermission
    }
  return (
    <PageContext.Provider value={values}>
        <ProjectView />
    </PageContext.Provider>
  )
}