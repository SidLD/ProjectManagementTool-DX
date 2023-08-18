import { useContext, useState } from 'react'
import { PageContext } from '../../lib/context'
import { TaskList } from '../../components/TaskList'
import {  Button, Select } from 'antd'
import Search from 'antd/es/input/Search'
import { DragDropContext } from 'react-beautiful-dnd'

export const TaskView = () => {
    const {loader, contextHolder, onDragEnd, taskList, fetchTasks} = useContext(PageContext)
    const [selecedSortIndex, setSelectedSortIndex] = useState(0)
    const [order, setOrder] = useState('asc')

    const handleSelectChange = (e) => {
      setSelectedSortIndex(e)
      fetchTasks(0, orderByOptions[selecedSortIndex], {})
    }

    const hanldeSubmitQuery = (e) => {
      if(e.trim() === ""){
        fetchTasks(0, orderByOptions[selecedSortIndex], {})
      }else{
        fetchTasks(0, orderByOptions[selecedSortIndex], e)
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
    <div className='p-1 pt-2'>
      <div className='mb-2  justify-start md:flex'>
        <div className='flex justify-start items-center'>
          <p className='dark:text-slate-200 mx-2'>Sort by:</p>
          <Select 
            style={{
              width: 120,
            }}
            options={options} 
            defaultValue={options[0]}
            onSelect={handleSelectChange}/>
            <Button onClick={handleOrder} className='dark:text-slate-200 uppercase mx-2'>
              {order === 'ASC' ? "ASCENDING" : "DESCENDING"}
            </Button>
        </div>
        <div className='flex justify-start items-center'>
        <Search className='md:mt-0 mt-2 dark:bg-slate-800 bg-slate-400 rounded-lg' placeholder="input search text" onSearch={hanldeSubmitQuery} enterButton="Search" size="middle" />
        </div>
      </div>
      {!loader && <div className='m-2 md:grid-cols-2 lg:grid-cols-3 md:mt-2 grid grid-cols-1 gap-3 rounded-lg font-poppins h-fit' >
              <DragDropContext
                onDragEnd={onDragEnd} >
                  { taskList.map(({title, tasks}) => {
                      return <TaskList key={title} title={title} tasks={tasks}/>
                    })
                  }
              </DragDropContext>
          </div>}
    </div>  
    </>
  )
}
