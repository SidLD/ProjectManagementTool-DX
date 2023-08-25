/* eslint-disable react/prop-types */
import {Avatar, Button, Progress, Tooltip} from 'antd'
import { useNavigate} from 'react-router-dom'
import {
    CaretRightOutlined
  } from '@ant-design/icons';
import { useEffect, useState } from 'react';
import { generateRandomStringColor } from '../../../lib/helper';
import { getTeamMembers } from '../../../lib/api';
export const ProjectCard = ({project}) => {
    const [team, setTeam] = useState([])
    const [loader, setLoader] = useState(true)
    const navigate = useNavigate()

    // const description = project.description.length > 150 ? `${project.description.substring(0,150) }...`: project.description;
    const dueDate = new Date(project.endDate);
    const dateLeft = new Date(dueDate - new Date())

    useEffect(() => {
        const fetchTeam = async () => {
            try {
              const payload = {
                projectId: project?.id, 
              }
              const response = await getTeamMembers(payload)
              setTeam(response.data.data)
            } catch (error) {
              console.log(error)
            }
          }
        fetchTeam()
        setLoader(false)
    },[])
    
    return (
        <div className='dark:bg-slate-700 hover:scale-105 hover:shadow-2xl delay-250 rounded-lg h-36 p-2 flex-col bg-slate-50 m-2' key={project.key}>
            <div className='w-full'>          
                <Tooltip className='float-right h-1/5 border-none hover:bg-slate-100' color='blue' title='View Project Detail'>
                    <Button className='dark:text-white flex justify-center items-center '
                        onClick={() => navigate(`/project/${project.id}`)}>
                        <CaretRightOutlined />
                        <CaretRightOutlined />
                    </Button>
                </Tooltip>
                <h1 className='dark:text-slate-200 text-md font-poppins my-2 text-lg text-slate-950 '>{ project.name}</h1>
                {!loader && <Avatar.Group maxCount={3} >
                        {team?.map((member,index) => (
                            <Tooltip key={index} title={`${member?.user?.firstName} ${member?.user?.lastName}`}>
                            <Avatar style={{backgroundColor:generateRandomStringColor()}} >{`${member?.user?.firstName} ${member?.user?.lastName}`}</Avatar>
                            </Tooltip>
                        ))}
                    </Avatar.Group>}
                <Tooltip className='flex w-full justify-between' title={project.progress}>
                   <Progress size="small" trailColor='gray' percent={50}/>
                </Tooltip>
                <div className='flex justify-between items-center'>
                    <div className={`${dateLeft.getDate() < 7  ? 'bg-red-200' : 'bg-blue-200'} rounded-3xl px-2 float-left`}>
                        <span className='text-sm flex justify-center items-center'>
                            <svg className="h-4 w-4 text-gray-500 mr-2"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  strokeWidth="2"  strokeLinecap="round"  strokeLinejoin="round">  <circle cx="12" cy="12" r="10" />  <polyline points="12 6 12 12 16 14" /></svg>
                            {dateLeft.getDate()} day/s left</span>
                    </div>
                </div>
            </div>
        </div>
    )
}
