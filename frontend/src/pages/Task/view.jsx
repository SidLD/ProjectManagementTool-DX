import { useContext, useState } from 'react'
import { PageContext } from '../../lib/context'
import { TaskList } from '../../components/TaskList'
import {  Button, Select } from 'antd'
import Search from 'antd/es/input/Search'

export const TaskView = () => {
    const {loader, contextHolder, fetchProject} = useContext(PageContext)
    const [selecedSortIndex, setSelectedSortIndex] = useState(0)
    const [order, setOrder] = useState('asc')
    const handleSelectChange = (e) => {
      setSelectedSortIndex(e)
      fetchProject( 0, orderByOptions[selecedSortIndex], {})
    }
    const hanldeSubmitQuery = (e) => {
      if(e.trim() === ""){
        fetchProject( 0, orderByOptions[selecedSortIndex], {})
      }else{
        fetchProject( 0, orderByOptions[selecedSortIndex], {
          OR: [
            {task: {
              contains: e
            }},
            {project:{
              name: {
                contains: e
              }
            }}
          ]
        })
      }

    } 
    const orderByOptions = [
      { startDate: order },
      { endDate: order},
      {project: {
        name: order
      }}
    ]
    const handleOrder = () => {
       if(order === 'ASC') {
        setOrder('desc')
       } else{
        setOrder('asc')
       }
    }
    const options = [
      {
        value: 0,
        label: "Start Date"
      },
      {
        value: 1,
        label: "End Date"
      },
      {
        value: 3,
        label: "Project Name"
      },
    ]
    
  return (
    <>
    {contextHolder}
    <div className='p-2'>
      <div className='mb-5  justify-start md:flex'>
        <div className='flex justify-start items-center'>
          <p className='mx-2'>Sort by:</p>
          <Select 
            style={{
              width: 120,
            }}
            options={options} 
            defaultValue={options[0]}
            onSelect={handleSelectChange}/>
            <Button onClick={handleOrder} className='uppercase mx-2'>{order === 'ASC' ? "ASCENDING" : "DESCENDING"}</Button>
        </div>
        <div className='flex justify-start items-center'>
        <p className='mx-2 w-32'>Search Task:</p>
        <Search placeholder="input search text" onSearch={hanldeSubmitQuery} enterButton="Search" size="middle" />
        </div>
      </div>
        {!loader && <div className='grid grid-cols-1 lg:grid-cols-3 gap-10 mx-2' >
          <div className='rounded-lg'>
            <h2 className='bg-white rounded-t-lg p-2 text-center text-blue-500 font-poppins font-bold text-lg'>To do Tasks</h2>
            <TaskList title={"TO DO"}/>
          </div>
          <div>
             <h2 className='bg-white rounded-t-lg p-2 text-center text-yellow-500 font-poppins font-bold text-lg'>In Progress Task</h2>
            <TaskList title={"IN PROGRESS"}/>
          </div>
          <div>
            <h2 className='bg-white rounded-t-lg p-2 text-center text-green-500 font-poppins font-bold text-lg'>Complete Task</h2>
            <TaskList title={"COMPLETED"}/>
          </div>
        </div>}
    </div>  
    </>
  )
}
