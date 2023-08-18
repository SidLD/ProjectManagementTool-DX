import { useContext, useEffect, useState } from "react"
import { createProject, getTaskCount } from "../lib/api"
import {Avatar, Button, DatePicker, Form, Input, Menu, Modal, Progress, Tooltip, message} from 'antd'
import {
    LogoutOutlined,
} from '@ant-design/icons';
import { useNavigate } from "react-router-dom";
import { auth } from "../lib/services";
import TextArea from "antd/es/input/TextArea";
import { AppContext } from "../lib/context";
import {create} from 'zustand';

import io from "socket.io-client";
//Need to add this before the component decleration
const socket = io(`${import.meta.env.VITE_API_URL}`,{
         transports: ["websocket"] });
         
const useStore = create((set) => ({
    completedTask: 0,
    setCompletedTask: (num) => set(() => ({ completedTask: num})),
    openTask: 0,
    setOpenTask: (num) => set(() => ({ openTask: num})),

}));
export const CustomeSider = () => {
    const {projects, fetchProject} = useContext(AppContext);
    const completedTask = useStore((state) => state.completedTask);
    const openTask = useStore((state) => state.openTask);
    const setCompletedTask = useStore((state) => state.setCompletedTask);
    const setOpenTask = useStore((state) => state.setOpenTask);

    const navigate = useNavigate()
    const user = auth.getUserInfo()
    const { RangePicker } = DatePicker;
    const [showModal, setShowModal] = useState(false)

    const onClick = (e) => {
        navigate(e.key)
    }

    const [messageAPI, contextHolder] = message.useMessage()
    const  showMessage = (type, content) => {
      messageAPI.open({
        type,
        content
      })
    }

    const handleSubmit = async (e) => {  
        try {
            const payload = {
                name: e.name,
                descripion: e.descripion,
                startDate: e.startEndTime[0],
                endDate: e.startEndTime[1],
            }
          const result = await createProject(payload)
          if(result.data.ok){
            socket.emit('createTask', payload)
            showMessage('success', 'Success')
            await fetchProject()
            navigate(`/project/${result.data.data.id}`)
          }
        } catch (error) {
          showMessage('warning', error.response.data.message)
        }
      
    }

    const getTaskNum = async () => {
        try {
            const complete = await getTaskCount({status: 'COMPLETED'})
            setCompletedTask(complete.data.data)
            const open = await getTaskCount({status: 'TO DO'})
            setOpenTask(open.data.data)
        } catch (error) {
            console.log(error)
            setCompletedTask(0)
            setOpenTask(0)
        }
    }
    const handleSearch = (e) => {
        setTimeout(async () => {
            await fetchProject(e.target.value)
        }, 2000)
    }
    useEffect(() => {
        getTaskNum()
    },[])
    
    return (
        <>
        {contextHolder}
        <div className='uppercase my-2 h-20 flex  bg-gray-900 justify-center items-center '>
            <Avatar size={50}>
                {
                `${
                    user.firstName
                } ${
                    user.lastName
                }`
            }</Avatar>
            <p className='ml-5 text-white text-lg text-center'>
                {
                `${
                    user.firstName
                } ${
                    user.lastName
                }`
            }</p>
        </div>
        <div className='mx-2 flex my-5 justify-evenly items-center'>
            <div className='text-white'>
                <p className='text-2xl '>{completedTask}</p>
                <p className='text-slate-500 text-sm'>Completed Task</p>
            </div>
            <div className='text-white'>
                <p className='text-2xl'>{openTask}</p>
                <p className='text-slate-500 text-s'>Open Task</p>
            </div>
        </div>
        <h2 className='mx-2 uppercase text-sm mr-2 bold sm:text-xl text-slate-400  mt-2'>Menu</h2>
        <div className='mx-2 mt-2'>
            <Button className='w-full text-white text-start border-none'
                onClick={
                    () => navigate('/dashboard')
            }>Dashboard</Button>
            <Button className='w-full text-white text-start  border-none'
                onClick={
                    () => navigate('/tasks')
            }>My Tasks</Button>
            
        </div>
        <h2 className='mx-2 uppercase text-sm mr-2 bold sm:text-xl text-slate-400 mt-5'>My Projects</h2>
        <div className="w-full flex justify-center items-center my-2">
            <Input placeholder="Search Project Title" className='mx-2 w-fit text-black  border-white ' onChange={handleSearch}/>
            <svg className="h-8 w-8 text-white"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  strokeWidth="2"  strokeLinecap="round"  strokeLinejoin="round">  <circle cx="11" cy="11" r="8" />  <line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
        </div>
        <Menu className=' hover:overflow-y-scroll bg-transparent text-white '
            onClick={onClick}
            mode='inline'
            items={
                projects.map((item) => ({
                    key: `/project/${
                        item.id
                    }`,
                    icon: <Progress strokeWidth={4} percent={item.progress} type="circle" trailColor={"white"} size={35} />,
                    label:<p>{item.name} </p>
                }))
            }/>
        <Button onClick={() => setShowModal(true)} 
            className='text-yellow-500 font-bold  w-full border-none hover:border-2 hover:border-white'
            >+ Add a Project</Button>
        <div className='absolute bottom-1 w-full'>
            <Tooltip className='text-white w-full border-none hover:border-2 hover:border-white' placement='rightTop' title='Logout' color='blue'>
                <Button className='text-white'
                    onClick={
                        () => navigate('/logout')
                }>
                    <LogoutOutlined/>
                </Button>
            </Tooltip>
        </div>
        <Modal open={showModal} onCancel={() => setShowModal(false)} footer={null}>
        <Form
                labelCol={{
                    span: 4,
                }}
                wrapperCol={{
                    span: 14,
                }}
                layout="horizontal"
                onFinish={handleSubmit}
                >
                <Form.Item label="Title" name="name"
                    rules={[
                    {
                        required: true,
                    },
                    ]}
                > 
                    <Input />
                </Form.Item>
                <Form.Item label="Description" name="descripion"
                    rules={[
                    {
                        required: true,
                    },
                    ]}
                > 
                    <TextArea rows={4} />
                </Form.Item>
                <Form.Item
                    name="startEndTime"
                    label={"Date"}
                    rules={[{ required: true, message: "Please add Start and End Date" }]}
                >
                <RangePicker
                    showTime={{
                    hideDisabledOptions: true,
                    }}
                    format="YYYY-MM-DD hh:mm a"
                    style={{ width: "100%" }}
                />
                </Form.Item>
                <Button className="w-full bg-blue-500 hover:text-slate-50" htmlType="submit">Create Project</Button>
                </Form>
        </Modal>
        </>
    )
}
