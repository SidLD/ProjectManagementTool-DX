import { useContext } from 'react'
import { PageContext } from '../../lib/context'
// import { TaskList } from '../../components/TaskList'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import {DnDComponents} from './components/DnDComponents'

export const TaskView = () => {
    const {loader, tasks, contextHolder} = useContext(PageContext)
    if(!loader){
      console.log(tasks)
    }
  return (
    <>
    {contextHolder}
    <div>
      <div>Options</div>
      <DndProvider backend={HTML5Backend}>
        <DnDComponents />
      </DndProvider>
    </div>
    </>
  )
}
