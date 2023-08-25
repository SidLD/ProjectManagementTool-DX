import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import {  
    deleteTask, 
    getLogs, 
    getPermission, 
    getProjects, 
    getTasks,
    subcribeTask,
    unsubcribeTask,
    updateTask } from "../../../lib/api"
import { message} from "antd"
import { TaskDetailView } from "./view"
import { PageContext } from "../../../lib/context";
import dayjs from "dayjs";

export const TaskDetail = () => {
    const {projectId, taskId} = useParams()
    const [project, setProject] = useState()
    const [task, setTask] = useState([])
    const [logs, setLogs] = useState([])
    const [loader, setLoader] = useState(true)
    const [messageAPI, contextHolder] = message.useMessage()
    const [userPermission, setPermission] = useState([])
    const navigate = useNavigate()

    const disabledDate = (current) => {
      // Can not select days before today and today
      return dayjs(project.startDate).endOf('day') >= current || current >= dayjs(project.endDate).endOf('day');
    };

    const handleSaveEdit = async (e) => {
      try {
        const payload = {
          task: e.name,
          description: e.description,
          startDate: new Date(e.startEndTime[0]),
          endDate: new Date(e.startEndTime[1])
        }
        const response = await updateTask(projectId, task.id , payload)
          if(response.data.ok){
            showMessage('success', `Success`)
            await fetchLogs()
            await fetchTask()
            return true
          }else{
            return false
          }
      } catch (error) {
        console.log(error)
        showMessage('warning', error?.response?.data?.message)
        return false
      }
    }

    const showMessage = (type, content) => {
        messageAPI.open({
          type,
          content
        })
      }
      const fetchTask = async () => {
        try {
          const response = await getTasks(projectId, {id: taskId})
          setTask(response.data?.data[0])
          if(!response.data.data){
            navigate(`/project/${projectId}`)
          }
        } catch (error) {
          console.log(error) 
          showMessage('warning', 'something went wrong')
          navigate(`/project/${projectId}`)
        }
      }

      const fetchLogs = async () => {
        try {
          const payload = {
            taskId: taskId
          }
          const response = await getLogs(payload)
          // setLogs(response.data?.data[0])
          setLogs(response.data.data)
          if(!response.data.data){
            navigate(`/project/${projectId}`)
          }
        } catch (error) {
          showMessage('warning', error.response.data.message)
          if(error.response.status === 403){
            showMessage('warning', "Navigating to Project")
            setTimeout(() => {
              navigate(`/project/${projectId}`)
            }, 1000)
          }
        } 
      }

      const handleStatusChange = async () => {
        try {
          let nextStatus = ""
          switch (task.status) {
            case "TO_DO":
              nextStatus = "IN_PROGRESS"
              break;
            case "IN_PROGRESS":
              nextStatus = "COMPLETED"
              break
            default:
              nextStatus = "TO_DO"
              break;
          }
          const response = await updateTask(projectId, task.id ,{status:nextStatus})
          if(response.data.ok){
            showMessage('success', `Set Status to ${nextStatus}`)
            await fetchLogs()
            await fetchTask()
          }
        } catch (error) {
          console.log(error)
          showMessage('warning', error.response.data.message)
        }
      }

      const handleDeleteTask = async () => {
        try {
          const response = await deleteTask(projectId, {id:task.id})
          if(response.data.ok){
            showMessage('success', 'Task Deleted')
            setTimeout(() => {
              navigate(`/dashboard/project/${projectId}`)
            }, 500)
          }
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
          showMessage('warning', "Navigating to Project")
          setTimeout(() => {
            navigate(`/project/${projectId}`)
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

      const handleAddUser = async (memberId) => {
        if(!memberId){return}
        try {
          const payload = {
            memberId
          }
          const response = await subcribeTask(task.project.id, task.id, payload)
          if(response.data.ok){
            showMessage('success', `Success`)
            await fetchTask()
            await fetchLogs()
            return true
          }else{
            showMessage('warning', response.data.message)
          }
        }catch(error){
          console.log(error)
          showMessage('warning', error.response.data.message)
          return false
        }
      }

      const handleRemoveUser = async (memberId) => {
        if(!memberId){return}
        try {
          const payload = {
            memberId
          }
          const response = await unsubcribeTask(task.project.id, task.id, payload)
          if(response.data.ok){
            showMessage('success', `Success`)
            await fetchTask()
            await fetchLogs()
            return true
          }else{
            showMessage('warning', response.data.message)
          }
        }catch(error){
          console.log(error)
          showMessage('warning', error.response.data.message)
          return false
        }
      }

      useEffect(() => {
        fetchTask()
        fetchLogs()
        fetchProject()
        getUserPermission()
        setLoader(false)
      },[])

      const values = {
        navigate,
        handleStatusChange,
        handleDeleteTask,
        handleSaveEdit,
        showMessage,
        disabledDate,
        handleAddUser,
        handleRemoveUser,
        logs,
        userPermission,
        loader,
        contextHolder,
        task,
        projectId,
        
      }
      return (
        <PageContext.Provider    value={values}>
            <TaskDetailView />
        </PageContext.Provider>
      )
}
