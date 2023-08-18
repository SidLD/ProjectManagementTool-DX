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
import moment from "moment";
import { TaskDetailView } from "./view"
import { PageContext } from "../../../lib/context";

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
      let customDate = new Date(project.startDate);
      return current && current < moment(customDate, "YYYY-MM-DD");
    }

    // const handleSaveEdit = () => {
    //   try {
    //     let startDate = task.startDate
    //     let endDate = task.endDate
    //     if(newDate[0] || newDate[1]){
    //      startDate = newDate[0]
    //      endDate = newDate[1] 
    //     }
    //     const payload = {
    //       task: task.task,
    //       description: task.description,
    //       startDate: startDate,
    //       endDate: endDate
    //     }
    //     console.log(payload)
    //   } catch (error) {
    //     console.log(error)
    //     showMessage('warning', error?.response?.data?.message)
    //   }
    // }
    // const onChangeTaskTitle = (e) => {
    //   setTask({...task,  task:e.target.value})
    // }
    // const onChangeDescription = (e) => {
    //   setTask({...task,  description:e.target.value}) 
    // }
    // const handleCalendarChange = (e) => {
    //   setNewDate(e)
    // }

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
            case "TO DO":
              nextStatus = "IN PROGRESS"
              break;
            case "IN PROGRESS":
              nextStatus = "COMPLETED"
              break
            default:
              nextStatus = "TO DO"
              break;
          }
          const response = await updateTask(projectId, task.id ,{status:nextStatus})
          if(response.data.ok){
            showMessage('success', `Set Status to ${nextStatus}`)
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
          console.log(response)
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
