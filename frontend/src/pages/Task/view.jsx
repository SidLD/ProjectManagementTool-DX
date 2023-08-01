import { useContext } from 'react'
import { PageContext } from '../../lib/context'
// import { TaskList } from '../../components/TaskList'
import { TaskList } from '../../components/TaskList'
import { Button, Dropdown } from 'antd'

export const TaskView = () => {
    const {loader, contextHolder} = useContext(PageContext)
  const sortItems = [
    {
      key: 'firstName',
      label: 'First Name'
    },
    {
      key: 'status',
      label: 'Status'
    }
  ]
  return (
    <>
    {contextHolder}
    <div>
      <div className='h-5 my-2 border-2 rounded-2xl border-black'>
        <Dropdown
          menu={{
            sortItems
          }}
        >
          <Button onClick={(e) => e.preventDefault()}>
              Sort
          </Button>
        </Dropdown>
      </div>
        {!loader && <div className='flex' >
          <TaskList title={"TO DO"}/>
          <TaskList title={"IN PROGRESS"}/>
          <TaskList title={"COMPLETED"}/>
        </div>}
    </div>  
    </>
  )
}
