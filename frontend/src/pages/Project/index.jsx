import { useLayoutEffect, useState } from 'react'
import { PageContext } from '../../lib/context'
import { ProjectView } from './view'
import { useNavigate, useParams } from 'react-router-dom'
import { message } from 'antd'
import moment from "moment";
import { createTasks, createTeamMember, deleteProject, getPermission, getProjects, getRoles, getTasks, getTeamMembers } from '../../lib/api'

export const Project = () => {
    const {projectId} = useParams()
    const [messageAPI, contextHolder] = message.useMessage()
    const [loader, setLoader] = useState(true)
    const [project, setProject] = useState({})
    const [permission, setPermission] = useState([])
    const [open, setOpen] = useState(false);
    const navigate = useNavigate()
    const [roles, setRoles] = useState([])
    const [team, setTeam] = useState([])
    const [tasks, setTasks] = useState([])
    const fetchTasks = async () => {
      try {
        const response = await getTasks(projectId, {})
        setTasks(response.data.data)
      } catch (error) {
        console.log(error)
      }
    }
    const fetchTeam = async () => {
      try {
        const payload = {
          projectId: projectId
        }
        const response = await getTeamMembers(payload)
        setTeam(response.data.data)
      } catch (error) {
        console.log(error)
      }
    }
    const handleSubmitTask = async (e) => {
      try {
        const payload = [
          {
            name: e.name,
            description: e.description,
            users: e.selectedUserForTask,
            startDate: new Date(e.startEndTime[0]),
            endDate: new Date(e.startEndTime[1])
          }
        ]
        const response = await createTasks(projectId, payload)
        if(response.data.ok){
          
          await fetchTasks()
          showMessage('success', 'Success')
          setIsModalOpen(false)
        }
      } catch (error) {
        console.log(error)
      }
    }
    //The server accept arrays
    const addTeamMember = async (data) => {
      try {
        const payload = [
          {
            ...data
          }
        ]
        const response = await createTeamMember(projectId, payload)
        if(response.data.ok){
          showMessage('success',"Success")
          fetchTeam()
        }else{
          showMessage('warning',"Something Went Wrong")
        }
      } catch (error) {
        showMessage('warning',error.response.data.message)
      }
    }
    const fetchRoles = async () => {
      try {
        const payload = {
          projectId: projectId
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
        showMessage('warning', 'ERROR DIDI')
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
    const [isModalOpen, setIsModalOpen] = useState(false);
    const showModal = () => {
      setIsModalOpen(true);
    };
    const handleCancel = () => {
      setIsModalOpen(false);
    };
    const [isModalOpenDelete, setIsModalOpenDelete] = useState(false);
    const showDeleteModal = () => {
      setIsModalOpenDelete(true);
    };
    const handleDeleteCancel = () => {
      setIsModalOpenDelete(false);
    };
    const showDrawer = () => {
      setOpen(true);
    };
    const onClose = () => {
      setOpen(false);
    };
    //This Limit the task start time, since task should not have start time before the project start time
    const disabledDate = (current) => {
      let customDate = new Date(project.startDate);
      return current && current < moment(customDate, "YYYY-MM-DD");
    }
    const handleDeleteProject = async (e) => {  
      try {
        const name = project.name
        if(name.trim() === e.name){
          const response = await deleteProject({projectId: projectId})
          if(response.data.ok){
            showMessage('success', 'Success and Redirecting')
            setTimeout(() => {
              navigate('/dashboard')
            }, 1000)
          }else{
            showMessage('warning', 'Something Went Wrong')
          }
        }else{
          showMessage('warning', 'Title Does not Match')
        }
      } catch (error) {
        console.log(error.response.data)
      }
    }
    const showMessage = (type, content) => {
      messageAPI.open({
        type,
        content,
      })
    }
    useLayoutEffect(() => {
      fetchProject()
      getUserPermission()
      fetchRoles()
      fetchTeam()
      fetchTasks()
      setLoader(false)
    },[])

    const values = {
      disabledDate,
      handleDeleteProject,
      isModalOpenDelete,
      showDeleteModal,
      handleDeleteCancel,
      open,
      showDrawer,
      onClose,
      handleCancel,
      handleSubmitTask,
      showModal,
      isModalOpen,
      contextHolder,
      loader,
      project,
      permission,
      roles,
      showMessage,
      addTeamMember,
      team,
      tasks
    }
  return (
    <PageContext.Provider value={values}>
        <ProjectView />
    </PageContext.Provider>
  )
}