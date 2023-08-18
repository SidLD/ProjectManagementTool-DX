/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { Draggable } from "react-beautiful-dnd";
import {TaskStatusColor} from "../lib/helper"
import {Avatar, Button, Tag, Tooltip} from "antd"
import { useNavigate } from "react-router-dom"
import {
    CaretRightOutlined
  } from '@ant-design/icons';
import { useEffect, useState } from "react";
import { getUserRole } from "../lib/api";
export const TaskItem = ({item, index}) => { 
    const navigate = useNavigate()
    const [role, setRole] = useState("")
    const description = item.description.length > 150 ? `${item.description.substring(0,120) }...`: item.description;
    const dueDate = new Date(item.endDate);
    const dateLeft = new Date(dueDate - new Date())

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
    },[])
    const colors = TaskStatusColor(item)
    return (
        <Draggable draggableId={item.id} index={index}>
            {(provided) => (
                <div 
                    ref={provided.innerRef}  
                    {...provided.draggableProps}  
                    {...provided.dragHandleProps}  
                    className={`dark:bg-slate-900 dark:text-slate-300  border-l-blue-500 border-l-4 bg-slate-200 rounded-lg my-2 h-28 px-2 shadow-sm hover:scale-105 delay-100 `}>
                <div className="mt-2 flex justify-between items-center">
                    <p className={`font-poppins text-lg font-bold`}>
                        { item.task}
                    </p>
                    <div className=" flex justify-between items-center">
                        <Tooltip placement='leftBottom' title="View Task Detail" color='blue'>
                            <Button className="dark:text-white border-none  flex gap-[0px] justify-end items-center cursor-pointer" 
                                onClick={() => navigate(`/project/${item.project.id}/tasks/${item.id}`)}>
                            <CaretRightOutlined />                            
                            <CaretRightOutlined />
                            </Button>
                        </Tooltip>
                    </div>
                </div>
                <div className="flex my-3 items-center">
                    <Tag className="dark:bg-slate-900" color="purple" >{role.name}</Tag>
                    <Tag className="dark:bg-slate-900" color="success">{item.project.name}</Tag>
                </div>
                <div className="my-2 w-[98%] flex  justify-between">
                    <div className={`dark:bg-slate-900 ${dateLeft.getDate() < 7  ? 'bg-red-200' : 'bg-blue-200'} rounded-3xl px-2 float-left`}>
                            <span className='text-sm flex justify-center items-center'>
                            <svg className="h-4 w-4 text-gray-500 mr-2"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  strokeWidth="2"  strokeLinecap="round"  strokeLinejoin="round">  <circle cx="12" cy="12" r="10" />  <polyline points="12 6 12 12 16 14" /></svg>
                            {dateLeft.getDate()} day/s left</span>
                    </div>
                    <Avatar.Group size="small"  >
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
            </div>
            )}
            
        </Draggable>
    )
}
