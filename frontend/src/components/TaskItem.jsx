/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import {useDrag} from "react-dnd"
import {TaskStatusColor} from "../lib/helper"
import {Avatar, Button, Tooltip} from "antd"
import { useNavigate } from "react-router-dom"
import {
    CaretRightOutlined
  } from '@ant-design/icons';
export const TaskItem = ({item}) => { // eslint-disable-next-line no-unused-vars
    const navigate = useNavigate()
    const [
        {
            isDragging
        }, drag
    ] = useDrag(() => ({
        type: "task",
        item: item,
        collect: (monitor) => (
            {
                isDragging: !!monitor.isDragging()
            }
        )
    }))
    const colors = TaskStatusColor(item)
    // console.log(colors)
    // console.log(item)
    
    return (
        <Tooltip title={item.description}>
            <div ref={drag} className={`h-20 m-2 p-2 shadow-md hover:scale-y-110 delay-100 ${
                    colors.border} border-4` }>
                <div className="flex justify-between items-center">
                    <p className={
                        `${
                            colors.color
                        }`
                    }>
                        {
                        item.task
                    }</p>
                    <Avatar.Group className="" >
                        {item.task_users.map(user => (
                            <Tooltip key={user.id} title={`${user.firstName} ${user.lastName}`}>
                            <Avatar style={
                                {backgroundColor: '#f56a00'}
                            }>
                                {user.firstName} </Avatar>

                        </Tooltip>
                        ))}
                    </Avatar.Group>
                </div>
                <div className="flex justify-between items-center">
                    <p className="font-bold">{item.project.name}</p>
                    <Tooltip placement='leftBottom' title="View Task Detail" color='blue'>
                        <Button className="border-none  flex justify-end items-center cursor-pointer" 
                            onClick={() => navigate(`/project/${item.project.id}/tasks/${item.id}`)}>
                        <CaretRightOutlined />
                        </Button>
                    </Tooltip>
                </div>
            </div>
        </Tooltip>
    )
}
