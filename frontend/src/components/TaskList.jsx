/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { useContext, useEffect, useState } from "react"
import { useDrop } from "react-dnd"
import { TaskItem } from "./TaskItem"
import { PageContext } from "../lib/context"
import { updateTask } from "../lib/api"
import { Button } from "antd"
import io from "socket.io-client";
//Need to add this before the component decleration
const socket = io(`${import.meta.env.VITE_API_URL}`,{
         transports: ["websocket"] });
//I passed the Get Data to Task Item to Render it when the drop succeed on the other list
export const TaskList = ({title}) => {
  const {fetchList, showMessage, projectId, updateData , setDropStatus, dropStatus, query} = useContext(PageContext)
  const [tasks, setTasks] = useState([])
  const [loader, setLoader] = useState(true)
  // eslint-disable-next-line no-unused-vars
  const [{isOver}, drop] = useDrop(() => ({
    accept: 'task',
    drop: (item) => addTask(item),
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),

  }))
  const addTask = async (item) => {
    if(item.status !== title){
      try {
        const payload = {
          status: title
        }
        const response = await updateTask(projectId, item.id, payload)
        if(response.data.ok){
          showMessage('success', `Set Status to ${title}`)
          setDropStatus("Success")
          await updateData()   
          await getData()
          setDropStatus(null)
        }else{
          showMessage('warning', response.data.message)
        }
      } catch (error) {
        console.log(error)
        showMessage('warning', error.response.data.message)
      }
    }
  }
  const getData = async (query) => {
    const payload = {
        task:{
          contains: query
        },
        status: title,
    }
    const data = await fetchList(payload)
    setTasks(data)
  }

  //Drop Status is use to render update project or other list in the client 
  useEffect(() => {
    socket.on('newTask', () => {
      getData(query)
    })
    getData(query)
    setLoader(false)
  }, [dropStatus, query])
  return (
    <>
    {!loader && <div ref={drop} className="hover:overflow-y-scroll overflow-x-hidden">
      {tasks.length > 0 ? <>
        {tasks.map(task => 
          <TaskItem key={task.id} item={task}/>
        )}
        <div className="flex justify-center w-full">
          <Button className="border-none uppercase text-center">Load 30 more days</Button>
        </div>
        </>
      : <h2 className="text-center h-10 flex items-center justify-center">You have no task here.</h2>}
    </div>}
    </>
  )
}
