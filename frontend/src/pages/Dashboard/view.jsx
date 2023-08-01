import {useContext, useState} from 'react'
import {PageContext} from '../../lib/context'
import {TaskList} from '../../components/TaskList'
import {ProjectCard} from './components/ProjectCard'
import Search from 'antd/es/input/Search'
import { Button, Tooltip } from 'antd'
import {
    CaretRightOutlined
  } from '@ant-design/icons';
export const DashboardView = () => {
    const {
        loader,
        contextHolder,
        projects,
        onSearch,
        navigate
    } = useContext(PageContext)

    const [showTask, setShowTask] = useState(true)
    return(!loader && <div className='lg:flex '>
        {contextHolder}
        <Button className='md:hidden float-left w-6 h-6 flex justify-center m-2 items-center' onClick={() => setShowTask(!showTask)}>
            <svg className="h-4 w-4 text-blue-500"  width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">  <path stroke="none" d="M0 0h24v24H0z"/>  <rect x="4" y="4" width="16" height="4" rx="1" />  <rect x="4" y="12" width="6" height="8" rx="1" />  <line x1="14" y1="12" x2="20" y2="12" />  <line x1="14" y1="16" x2="20" y2="16" />  <line x1="14" y1="20" x2="20" y2="20" /></svg>
        </Button>
        <div className='p-2 lg:w-1/3'>
            <div className={`hidden shadow-md md:block  ${showTask && '!block'}`}>
                <div className='w-full flex rounded-t-xl justify-between  p-2 bg-slate-50'>
                    <h2 className='text-center'>Tasks</h2> 
                    <Tooltip title="View All Tasks">
                        <span className='cursor-pointer hover:bg-slate-100 rounded-md text-center' 
                            onClick={() => navigate('/tasks')}>
                                <CaretRightOutlined />
                        </span>
                    </Tooltip>
                </div>
                {!loader && <TaskList title={"ALL"}/>} 
            </div>
        </div>
        <div className='mt-5 p-2 lg:w-2/3 lg:flex-row'>
            <h2 className='text-center m-2 font-poppins text-2xl'>My Projects</h2>
            <div className='flex w-full justify-between'>
                <Search placeholder="Search Project Title"
                    onSearch={onSearch}
                    style={
                        {
                        width: 200,
                        marginRight: '5px',
                        }
                    }/>
                <Button className='' onClick={() => navigate('/project/create')}>
                    Create Project
                </Button>
            </div>
            <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5'>
                {projects.length ? projects.map((project, index) => <ProjectCard project={project} key={index}/>)
                    :
                <h2 className='text-center w-full'>You have no Projects</h2>
                }
        </div>
        </div>
        
    </div>)
}
