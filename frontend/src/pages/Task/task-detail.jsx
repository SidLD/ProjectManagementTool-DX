import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { deleteTask, getLogs, getTasks, updateTask } from "../../lib/api"
import { Button, Tooltip, message } from "antd"
import { CustomeDate } from "../../components/CustomeDate"
import { TaskStatusColor, formatDate } from "../../lib/helper"
import {
  CaretRightOutlined,
} from '@ant-design/icons';

export const TaskDetail = () => {
    const {projectId, taskId} = useParams()
    const [task, setTask] = useState([])
    const [logs, setLogs] = useState([])
    const [loader, setLoader] = useState(true)
    const [showLogs, setShowLogs] = useState(true) 
    
    const [messageAPI, contextHolder] = message.useMessage()
    const navigate = useNavigate()
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
          console.log(error) 
          showMessage('warning', 'something went wrong')
          navigate(`/project/${projectId}`)
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
      useEffect(() => {
        fetchTask()
        fetchLogs()
        setLoader(false)
      },[])
  return (
    <>
    {contextHolder}
    {!loader && <div className="p-2">
      <div className="">
          <Tooltip className="float-right" color={TaskStatusColor(task).color} title={TaskStatusColor(task).text}>
            <Button className={`${TaskStatusColor(task).backGroundColor} flex items-center`}
              onClick={handleStatusChange}
            >{task.status} <CaretRightOutlined/></Button>
          </Tooltip>
          <h2 className="">Task: {task.task}</h2>

        <p>Description: {task.description}</p>
        <div className='flex justify-evenly my-5'>
          <CustomeDate borderColor="border-blue-800" title="Start Date" color="text-blue-500" date={task.startDate} />
          <CustomeDate borderColor="border-yellow-500" title="Due Date" color="text-yellow-500" date={task.endDate}/>
        </div>
        <div className="">
            <Button className="bg-red-500 text-slate-50 hover:scale-110" onClick={handleDeleteTask}>Delete Task</Button>
        </div>
      </div>
      <div className="p-2 bg-slate-700 h-full rounded-xl">
        
      <Button className="bg-blue-500 text-white " 
          onClick={() => setShowLogs(!showLogs)}
        >Logs</Button>
        <div className={showLogs ? 'block': 'hidden'}>
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
    </>
  )
}
