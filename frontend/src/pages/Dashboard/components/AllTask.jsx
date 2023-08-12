/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { useEffect, useState } from "react"
import { ALlTaskItem } from "./ALlTaskItem"
import { Button } from "antd"
import { getAllTasks } from "../../../lib/api"

//I passed the Get Data to Task Item to Render it when the drop succeed on the other list
export const AllTask = () => {
  const [tasks, setTasks] = useState([])
  const [loader, setLoader] = useState(true)
  // eslint-disable-next-line no-unused-vars


  const fetchTasks = async (data) => {
    try {
      const payload = {
          ...data,
          status:"IN PROGRESS"
      }
      const response = await getAllTasks( payload)
      setTasks(response.data.data)
    } catch (error) {
      console.log(error)
      return []
    }
  }
 
  useEffect(() => {
    fetchTasks()
    setLoader(false)
  }, [])
  return (
    <>
    {!loader && <div className="hover:overflow-y-scroll overflow-hidden ">
      {tasks.length > 0 ? <>
        {tasks.map(task => 
          <ALlTaskItem key={task.id} item={task}/>
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
