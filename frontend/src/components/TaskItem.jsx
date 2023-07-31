/* eslint-disable react/prop-types */

import { Button, Tooltip } from "antd"
import { TaskStatusColor } from "../lib/helper"
import {
    CaretRightOutlined,
    CaretLeftOutlined
  } from '@ant-design/icons';

export const TaskItem = ({item, navigate}) => {
    const colorStatus =  TaskStatusColor(item)
    return <li key={item.id}>
        <Tooltip title={item.description} placement="right">
            <div className={`p-2 bg-slate-50 border-l-8 ${colorStatus.border} hover:scale-105 delay-250 shadow-lg m-2 rounded-r-lg h-24`}>
                <div className='flex justify-between m-2'>
                    <h2>{item.task}</h2>
                    <h2>{item.project.name}</h2>
                </div>
                
                <Button className="relative top-4 flex items-center border-none hover:bg-gray-500 hover:text-slate-50  float-left" onClick={() => {navigate(`/project/${item.project.id}`)}}><CaretLeftOutlined />Project </Button>
                <Button className="relative top-4 flex items-center border-none hover:bg-gray-500 hover:text-slate-50  float-right" onClick={() => {navigate(`/project/${item.project.id}/tasks/${item.id}`)}}>Detail <CaretRightOutlined /></Button>
            </div>
        </Tooltip>
    </li>
}
