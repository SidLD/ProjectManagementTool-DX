/* eslint-disable react/prop-types */

import { TaskItem } from './TaskItem';
import { useNavigate } from 'react-router-dom';
export const TaskList = ({data}) => {
  const navigate = useNavigate()
  return (
    <>
      { data.length > 0 ?  <ul>
        {data?.map((task) => <TaskItem key={task.id} item={task} navigate={navigate}/>)}
      </ul> : 
        <h3 className='text-center'>You Have No Tasks</h3>  
      }
    </>
    
    
  )
}