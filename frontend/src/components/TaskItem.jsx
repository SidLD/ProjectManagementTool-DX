/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import {useDrag} from "react-dnd"
import {TaskStatusColor} from "../lib/helper"
import {Avatar, Button, Tag, Tooltip} from "antd"
import { useNavigate } from "react-router-dom"
import {
    CaretRightOutlined
  } from '@ant-design/icons';
import { useEffect, useState } from "react";
import { getUserRole } from "../lib/api";
export const TaskItem = ({item}) => { 
    const navigate = useNavigate()
    const [role, setRole] = useState("")
    const description = item.description.length > 150 ? `${item.description.substring(0,120) }...`: item.description;
    const dueDate = new Date(item.endDate);
    const dateLeft = new Date(dueDate - new Date())
    const [
        {
            isDragging
        }, drag
    ] = useDrag(() => ({
        type: "task",
        item: item,
        collect: (monitor) => (
            {
                isDragging: !!monitor.isDragging(),
                
            }
        ),
    }))
    useEffect(() => {
        const fetchUserRole = async () => {
            try {
                const payload = {
                    projectId: item.project.id
                }
                const response = await getUserRole(payload)
                setRole(response.data.data)
            } catch (error) {
               console.log(error) 
            }
        }
        fetchUserRole()
    })
    const colors = TaskStatusColor(item)
    return (
            <div ref={drag} className={` bg-white rounded-t-lg h-48 my-2 p-2 shadow-sm hover:scale-y-110 delay-100 
                    ${colors.border}`}>
                <div className="h-[10%] mt-2 flex justify-between items-center">
                    <p className={`font-poppins text-lg font-bold`}>
                        { item.task}
                    </p>
                    <Avatar.Group className="" >
                        {item.task_member.map(member => (
                            <Tooltip key={member.user.id} title={`${member.user.firstName} ${member.user.lastName}`}>
                            <Avatar style={
                                {backgroundColor: '#f56a00'}
                            }>
                                {member.user.firstName} </Avatar>

                        </Tooltip>
                        ))}
                    </Avatar.Group>
                </div>
                <Tooltip className="h-[40%] w-full" title={item.description}>
                    <p className="break-words">{description}</p>
                </Tooltip>
                <div className="h-[25%] flex items-center">
                    <Tag className="" color="purple" >{role.name}</Tag>
                    <Tag className="" color="success">{item.project.name}</Tag>
                </div>
                <div className="h-[15%]  flex justify-between">
                    <div className={`${dateLeft.getDate() < 7  ? 'bg-red-200' : 'bg-blue-200'} rounded-3xl px-2 float-left`}>
                            <span className='text-sm flex justify-center items-center'>
                                <svg className="h-4 w-4 text-gray-500 mr-2"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  strokeWidth="2"  strokeLinecap="round"  strokeLinejoin="round">  <circle cx="12" cy="12" r="10" />  <polyline points="12 6 12 12 16 14" /></svg>
                                {dateLeft.getDate()} day/s left</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <Tooltip placement='leftBottom' title="View Task Detail" color='blue'>
                            <Button className="border-none  flex justify-end items-center cursor-pointer" 
                                onClick={() => navigate(`/project/${item.project.id}/tasks/${item.id}`)}>
                            <CaretRightOutlined />
                            </Button>
                        </Tooltip>
                    </div>
                </div>
            </div>
    )
}
