import {useContext, useState} from 'react'
import {PageContext} from '../../lib/context'
import {ProjectCard} from './components/ProjectCard'
import { Button, Input, Modal, Tooltip } from 'antd'
import {
    CaretRightOutlined
  } from '@ant-design/icons';
import { AllTask } from './components/AllTask';
export const DashboardView = () => {
    const {
        loader,
        contextHolder,
        projects,
        onSearch,
        navigate,
        order,
        toggleOrder
    } = useContext(PageContext)
    const [showTask, setShowTask] = useState(false)
    return (
        !loader && <div className='lg:flex  overflow-x-hidden'>
        {contextHolder}
            <div className='lg:w-2/3 lg:flex-row'>
                <div className='my-2 flex justify-normal items-center'>
                    <Input className='ml-2' placeholder="Search Project Title"
                        onChange={onSearch}
                        style={
                            {
                            width: 200,
                            marginRight: '5px',
                            }
                        }/>
                    <Button className='dark:text-white shadow-md border-none text-start font-poppins text-blue-500 ' 
                        onClick={toggleOrder}>Sort {order ? 'Asc' : 'Desc'}</Button>
                    <Tooltip title="Show Tasks">
                        <Button className='md:hidden dark:text-white p-0 w-8 h-8 flex justify-center m-2 items-center' 
                            onClick={() => setShowTask(!showTask)}>
                            <svg className="h-6 w-6 text-blue-500  dark:text-white"  width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">  <path stroke="none" d="M0 0h24v24H0z"/>  <rect x="4" y="4" width="16" height="4" rx="1" />  <rect x="4" y="12" width="6" height="8" rx="1" />  <line x1="14" y1="12" x2="20" y2="12" />  <line x1="14" y1="16" x2="20" y2="16" />  <line x1="14" y1="20" x2="20" y2="20" /></svg>
                        </Button>
                    </Tooltip>
                </div>
                <div className='grid md:grid-cols-2 gap-1'>
                {projects.length ? projects.map((project, index) => <ProjectCard project={project} key={index}/>)
                    :
                    <h2 className='text-center w-full'>You have no Projects</h2>
                }
                </div>
            </div>
            <div className='p-2 h-full hidden md:block lg:w-1/3'>
                <div className='w-full flex rounded-t-xl justify-between  p-2 dark:bg-dark bg-slate-50'>
                    <h2 className='text-center font-poppins'>In Progress Tasks</h2> 
                    <Tooltip placement='left' title="View All Tasks">
                        <span className='cursor-pointer hover:bg-slate-100 rounded-md text-center' 
                            onClick={() => navigate('/tasks')}>
                                <CaretRightOutlined />
                        </span>
                    </Tooltip>
                </div>
                {!loader &&  <AllTask/>}
            </div>
            <Modal footer={null} open={showTask} onCancel={() => setShowTask(false)}>
            <div className='w-full shadow-lg flex rounded-t-xl justify-between mt-4 p-2 bg-slate-50'>
                 <h2 className='text-center font-poppins'>Tasks</h2> 
                 <Tooltip placement='left' title="View All Tasks">
                     <span className='cursor-pointer hover:bg-slate-100 rounded-md text-center' 
                         onClick={() => navigate('/tasks')}>
                             <CaretRightOutlined />
                     </span>
                 </Tooltip>
                        </div>
                        {!loader && <AllTask/>} 
            </Modal>
        
    </div>)
}
