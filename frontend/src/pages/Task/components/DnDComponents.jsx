import { useState } from "react"
import { DndItem } from "./DndItem"
import { useDrop } from "react-dnd"
export const DnDComponents = () => {
  const items = [
    {
      id: 1,
      task: 'Hello',
      users: ['First', 'second'],
      status: "TO DO"
    },
    {
      id: 2,
      task: 'Hello2',
      users: ['First', 'second'],
      status: "TO DO"
    }
  ]
  const [dropItems, setDropItems] = useState([])
  const [{isOver}, drop] = useDrop(() => ({
    accept: 'task',
    drop: (item) => addTask(item),
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }))
  const addTask = (item) => {
    setDropItems([...dropItems, item])
    console.log(dropItems)
  }
  return (
    <div>
        <div className="h-52 w-1/3 border-black border-2">
          {items.map(item => {
            return <DndItem key={item.id} item={item}/>
          })}

        </div>
        <div ref={drop} className="h-screen border-4 border-slate-800">
          Board
          {dropItems.map(dropItem => <div 
            key={dropItem.id}>
              {dropItem.task}
            </div>)}
        </div>
    </div>
  )
}
