/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { useContext, useEffect, useState } from "react"
import { useDrop } from "react-dnd"
import { TaskItem } from "./TaskItem"
import { PageContext } from "../lib/context"


export const TaskList = ({title}) => {
  const {handleStatusChange, tasks} = useContext(PageContext)

  const [dropItems, setDropItems] = useState([])
  // eslint-disable-next-line no-unused-vars
  const [{isOver}, drop] = useDrop(() => ({
    accept: 'task',
    drop: (item) => addTask(item),
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }))
  const addTask = (item) => {
    if(item.status !== title){
      handleStatusChange(item, title)
    }
  }
  const statusFilter = (data = [], status) => {
    return data.filter(temp => temp.status === status);
  } 
  useEffect(() => {
    setDropItems(statusFilter(tasks, title))
  }, [tasks])
  return (
    <div ref={drop} className="h-full w-full bg-white rounded-b-lg shadow-md overflow-auto hover:overflow-y-scroll">
      {dropItems.length > 0 ? dropItems.map(dropItem => <TaskItem 
          key={dropItem.id} 
          item={dropItem}/>
      ): <h2 className="text-center h-10 flex items-center justify-center">You have no task here.</h2>}
    </div>
  )
}
