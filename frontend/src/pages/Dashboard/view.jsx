import {useContext} from 'react'
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
        tasks,
        onSearch,
        navigate
    } = useContext(PageContext)
    return(!loader && <div className='flex'>
        {contextHolder}
        <div className='w-1/4 m-4 bg-blue-500 rounded-lg p-2 h-fit shadow-2xl'>
            <div className='flex justify-between'>
                <h2 className='uppercase text-lg'>Tasks</h2> 
                <Tooltip title="View All Tasks">
                    <span className='cursor-pointer hover:bg-slate-100 rounded-md text-center' 
                        onClick={() => navigate('/tasks')}>
                            <CaretRightOutlined />
                    </span>
                </Tooltip>
            </div>
            {!loader && <TaskList data={tasks}/>} </div>
        <div className='w-3/4'>
            <div className='flex p-2 m-5 justify-between'>
                <h2 className='text-3xl'>My Projects</h2>
                <div className='flex justify-end'>
                    <Search placeholder="Search Project Title"
                        onSearch={onSearch}
                        style={
                            {
                            width: 200,
                            marginRight: '5px',
                            }
                        }/>
                    <Button className='bg-blue-500 text-slate-50 hover:bg-slate-50' onClick={() => navigate('/project/create')}>
                        Create Project
                    </Button>
                </div>
            </div>
            <div className='grid grid-cols-2 gap-5'>
                {projects.length ? projects.map((project, index) => <ProjectCard project={project} key={index}/>)
                    :
                <h2 className='text-slate-500 text-2xl'>You have no Projects</h2>
                }
             </div>
        </div>
    </div>)
}
