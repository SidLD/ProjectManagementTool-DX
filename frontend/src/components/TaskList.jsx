/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { Droppable } from "react-beautiful-dnd"
import { TaskItem } from "./TaskItem"

import { Button } from "antd"

export const TaskList = ({title, tasks}) => {

  return (
    <Droppable droppableId={title}>
        {(provided) => (
          <div 
            className="bg-slate-300 dark:bg-slate-800 md:h-[80vh] rounded-lg p-2 overflow-x-hidden overflow-y-scroll"
            {...provided.droppableProps}
            ref={provided.innerRef}
            >
            <h2 className="dark:text-white font-poppins text-lg">{title.replace('_', ' ')}</h2>


            {tasks.map((task, index) => <TaskItem key={task.id} index={index} item={task}/>  )}

            {provided.placeholder}
            {tasks.length > 0 ? <div className="flex justify-center w-full">
              <Button
                className="dark:text-slate-500 hover:text-slate-50   hover:scale-125 hover:shadow-lg ease-in-out delay-200 border-none uppercase text-center">
                  Load 30 more days</Button>
            </div>
            :
              <p className="dark:text-white font-poppins text-center m-2">You have no tasks here</p>
            }
          </div>
        )}
      </Droppable> 
  )
}
