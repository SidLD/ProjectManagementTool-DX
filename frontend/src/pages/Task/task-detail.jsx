import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { assignTask, deleteTask, getLogs, getPermission, getProjects, getTasks, getTeamMembers, unsubcribeTask, updateTask } from "../../lib/api"
import { Button, Form, Input, Modal, Tooltip, message, DatePicker, Table, Select, Drawer } from "antd"
import { CustomeDate } from "../../components/CustomeDate"
import { TaskStatusColor, formatDate } from "../../lib/helper"
import {
  CaretRightOutlined,
} from '@ant-design/icons';
import { CommentBox } from "../../components/CommentBox"
import { PageContext } from "../../lib/context"
import TextArea from "antd/es/input/TextArea"
import moment from "moment";

export const TaskDetail = () => {
    const {projectId, taskId} = useParams()
    const [project, setProject] = useState()
    const [task, setTask] = useState([])
    const [logs, setLogs] = useState([])
    const [loader, setLoader] = useState(true)
    const [showLogs, setShowLogs] = useState(true) 
    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [messageAPI, contextHolder] = message.useMessage()
    const [permission, setPermission] = useState([])
    const [newDate, setNewDate] = useState([])
    const [queryUsers, setQueryUsers] = useState([])
    const [selectedUser, setSelectedUser] = useState()
    const [showAddMember, setShowAddMember] = useState(false)
    const [drawer, showDrawer] = useState(false)
    const navigate = useNavigate()
    const { RangePicker } = DatePicker;

    const disabledDate = (current) => {
      let customDate = new Date(project.startDate);
      return current && current < moment(customDate, "YYYY-MM-DD");
    }
    const handleSaveEdit = () => {
      try {
        let startDate = task.startDate
        let endDate = task.endDate
        if(newDate[0] || newDate[1]){
         startDate = newDate[0]
         endDate = newDate[1] 
        }
        const payload = {
          task: task.task,
          description: task.description,
          startDate: startDate,
          endDate: endDate
        }
        console.log(payload)
      } catch (error) {
        console.log(error)
        showMessage('warning', error?.response?.data?.message)
      }
    }
    const onChangeTaskTitle = (e) => {
      setTask({...task,  task:e.target.value})
    }
    const onChangeDescription = (e) => {
      setTask({...task,  description:e.target.value}) 
    }
    const handleCalendarChange = (e) => {
      setNewDate(e)
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
          console.log(response.data.data)
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
      const handleShowDeleteModal = () => {
        setShowDeleteModal(true);
      };
      const handleDeleteCancel = () => {
        setShowDeleteModal(false)
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
      const onSearch = async (query) => {
        try {
            const payload = {
                projectId,
                user: { 
                  OR: [
                    {email:query}, 
                    {firstName:query}, 
                    {lastName: query}
                  ]
                },
                sort: {
                  user: {
                    firstName: 'desc'
                  }
                },
                start: 0,
                limit : 5
            }
            setTimeout(async () =>{
               const response =  await getTeamMembers(payload)
               console.log('Query',response.data.data)
               setQueryUsers(response.data.data)
            },1000)
        } catch (error) {
          setQueryUsers([])
        }
      }
      const handleSelect = (value) => {
        setSelectedUser(value)
        setShowAddMember(true)
      };
      const handleCancelAddUser = () => {
        setShowAddMember(false)
      }
      const handleAddUser = async () => {
        if(!selectedUser){return}
        try {
          const currentMember = task?.task_users?.map(user => ({id: user.id}))
          const payload = {
            task_users : {
              connect: [
                ...currentMember,
                ({id: selectedUser})
              ]
            }
          }
          const response = await assignTask(task.project.id, task.id,payload)
          console.log(response)
          if(response.data.ok){
            showMessage('success', `Success`)
            await fetchTask()
            await fetchLogs()
            setShowAddMember(false)
          }else{
            showMessage('warning', response.data.message)
          }
        }catch(error){
          console.log(error)
          showMessage('warning', error.response.data.message)
        }
      }
      const handleRemoveUser = async (selectedId) => {
        try {
          const currentMember = task?.task_users?.filter(user => 
            (user.id !== selectedId && ({id: user.id})))
          const payload = {
            task_users : {
              set: currentMember
            }
          }
          const response = await unsubcribeTask(task.project.id, task.id,payload)
          if(response.data.ok){
            showMessage('success', `Success`)
            await fetchTask()
            await fetchLogs()
            setShowAddMember(false)
          }else{
            showMessage('warning', response.data.message)
          }
        }catch(error){
          console.log(error)
          showMessage('warning', error.response.data.message)
        }
      }
      const columns = [
        {
          title: 'Name',
          dataIndex: 'name',
          key: 'name',
        },
        {
          title: 'Role',
          dataIndex: 'role',
          key: 'role',
        },
        {
          title: 'Action',
          dataIndex: 'action',
          key: 'action',
        }
      ]
      useEffect(() => {
        fetchTask()
        fetchLogs()
        fetchProject()
        getUserPermission()
        setLoader(false)
      },[])
    return (
    <>
    {contextHolder}
    {!loader && <div className="p-2 lg:flex h-screen">
      <div className="lg:w-1/2 lg:mr-2 bg-white rounded-lg shadow-lg p-2">
          <div className="float-right flex w-full justify-between mb-5">
          <Tooltip color="blue" title="Project Detail">
            <Button className="bg-blue-500 text-white" onClick={() => navigate(`/project/${projectId}`)}>
              Project
            </Button>
          </Tooltip>
          <Tooltip  color={TaskStatusColor(task).color} title={TaskStatusColor(task).text}>
            <Button className={`${TaskStatusColor(task).backGroundColor} flex items-center`}
              onClick={handleStatusChange}
            >{task.status} <CaretRightOutlined/></Button>
          </Tooltip>
          </div>
          <div className="mt-5">
            <p>Task: {task.task} </p>
            <p>Description: {task.description} </p>
          </div>
        <div className='flex justify-evenly my-5'>
          <CustomeDate borderColor="border-blue-800" title="Start Date" color="text-blue-500" date={task.startDate} />
          <CustomeDate borderColor="border-yellow-500" title="Due Date" color="text-yellow-500" date={task.endDate}/>
        </div>
        <PageContext.Provider value={{task}}>
            {!loader && <CommentBox data={task}/>}
          </PageContext.Provider>
      </div>
      <div className="lg:w-1/2 p-2 bg-slate-700 h-4/5 rounded-xl overflow-hidden">       
        <div className="flex justify-between items-center">
        <Button className="bg-blue-500 text-white " 
          onClick={() => setShowLogs(!showLogs)}
        >History</Button>
        
        {permission.includes("EDIT-TASK") && <Button className='border-2 text-slate-50 hover:text-black bg-red-500'  
              onClick={() => showDrawer(true)}>Task Setting</Button>}
            
        </div>
        <div className={`${showLogs ? 'block': 'hidden'} overflow-y-scroll h-full`}>
          {logs?.map((log, index) => {
            const date = formatDate(log.createdAt);
            return <div key={index} className="flex justify-between items-center my-2">
                <p className="text-gray-500">{`${log.detail} by ${log.user.firstName}, ${log.user.lastName}`} </p>
                <p className="text-xs">{`${date.min}m ${date.hour}hr ${date.day} ${date.month}`}</p>
              </div>
          })}
        </div>
      </div>
    </div>}
    <Modal title="Delete Task" open={showDeleteModal} onCancel={handleDeleteCancel}
        footer={null}>
        <Form onFinish={handleDeleteTask}>
        <p className='text-red-700 mb-2'>Are you sure to delete this Task?</p>
          <Button  htmlType='submit' danger type='primary'>Confirm</Button>
        </Form>
    </Modal>
    <Modal title="Delete Task" open={showAddMember} onCancel={handleCancelAddUser}
        footer={null}>
        <Form onFinish={handleAddUser}>
        <p >Confirm to Assign Member to this Task?</p>
          <Button  htmlType='submit' danger type='primary'>Confirm</Button>
        </Form>
    </Modal>
    <Drawer open={drawer} onClose={() => showDrawer(false)} width={600}>
    <div>
      <div className="mt-5">
          <p>Task: <Input onChange={onChangeTaskTitle} style={{color: "black"}} value={task.task} /></p>
          <p>Description: <TextArea onChange={onChangeDescription} style={{color: "black"}} value={task.description} /></p>
      </div>
      <div>
            <RangePicker
            onCalendarChange={handleCalendarChange}
            disabledDate={disabledDate}
            showTime={{
              hideDisabledOptions: true,
            }}
            format="YYYY-MM-DD hh:mm a"
            style={{ width: "100%" }}
          />  
      </div>
      <Button className="w-full bg-green-500" onClick={handleSaveEdit}>Save</Button>
        <Tooltip className="blue" 
              title={(!permission.includes("ADD-MEMBER") || (!permission.includes("DELETE-MEMBER"))) && "You need permission"}>
              <Select 
                showSearch
                onSearch={onSearch}
                onSelect={handleSelect}
                placeholder="Search Member to add"
                disabled={!permission.includes("ADD-MEMBER")}
                filterOption={(input, option) =>
                  (option?.label ?? '').toLowerCase().includes(input.toLowerCase() || "")
                }
                options={queryUsers.map(item => (
                    {
                        value: item.user.id,
                        label: `${item.user.email} ${item.user.firstName} ${item.user.lastName}`
                    }
                ))}
              />
              {permission.includes("VIEW-MEMBER") && <Table 
                className="border-2 rounded-2xl border-slate-400 p-2"
                dataSource={task?.task_users.map(user => ({
                key: user.id,
                name: `${user.firstName} ${user.lastName}`,
                role: "Test",
                action: <>{permission.includes("DELETE-MEMBER") && <Button
                  onClick={() => handleRemoveUser(user.id)}
                >Remove</Button>}</>
              }))} columns={columns} />}
        </Tooltip>
        <Button className="bg-red-500 text-slate-50 hover:scale-110" onClick={handleShowDeleteModal}>Delete Task</Button>
      </div>
    </Drawer>
    </>
  )
}
