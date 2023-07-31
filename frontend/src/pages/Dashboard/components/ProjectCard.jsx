/* eslint-disable react/prop-types */
import {Button, Progress, Tooltip} from 'antd'
import { useNavigate} from 'react-router-dom'
import { generateRandomStringColor } from '../../../lib/helper';
import {
    CaretRightOutlined
  } from '@ant-design/icons';
export const ProjectCard = ({project}) => {
    const navigate = useNavigate()
    const description = project.description.length > 150 ? `${project.description.substring(0,150) }...`: project.description;
    return (
        <div className='border rounded-lg h-52 p-2 flex bg-slate-50 shadow-lg m-2' key={project.key}>
            <div className='w-1/2 flex-col justify-end'>
            <div className='w-full bg-green-500'></div>
                <div className='text-md h-4/5'>
                    <h1>Title: { project.name}</h1>
                    <p className='text-justify'>Description: {description}</p>
                </div>
                <Tooltip color='blue' title='View Project Detail' className='h-1/5 bg-blue-500 hover:bg-slate-100'>
                    <Button
                        className=''
                        onClick={() => navigate(`/project/${project.id}`)}
                    >
                        View Detail <CaretRightOutlined />
                    </Button>
                </Tooltip>
            </div>
            <div className='w-1/2 flex justify-center items-center'>
                <Progress type='circle' trailColor={generateRandomStringColor()} percent={project.progress}/>
            </div>
        </div>
    )
}
