
import { useContext, useState } from 'react';
import { PageContext } from '../../../lib/context';
import { TaskStatusColor } from '../../../lib/helper';
import { CustomeDate } from '../../../components/CustomeDate';
import {CommentBox}  from '../components/CommentBox'
import {Button, Tooltip, Modal, Form, Select } from 'antd';
import {
    CaretRightOutlined,
} from '@ant-design/icons';
import { Logs } from '../components/Logs';
import { TeamTable } from '../components/TeamTable';
import { getTeamMembers } from '../../../lib/api';
export const TaskDetailView = () => {
    const {
        handleDeleteTask, 
        contextHolder, 
        loader, 
        task, 
        navigate, 
        projectId, 
        handleStatusChange,
        handleAddUser
    } = useContext(PageContext)
    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [showAddUserModal, setShowAddUserModal] = useState(false)
    const [searchData, setSearchData] = useState([])
    const [selectedMember, setSelectedMember] = useState()
    const addUser = async () => {
     const isSuccess = await handleAddUser(selectedMember)
     if(isSuccess) {
      setShowAddUserModal(!showAddUserModal);
     }
    }
    const onSearch = async (query) => {
      try {
          const payload = {
            user: {
              OR: [
                {firstName: query},
                {lastName: query},
                {email: query}
              ]
            },
            // team_tasks: {
            //   none: {
            //     id:task.id
            //   }
            // },
            projectId: task.project.id,
            limit: 5
          }
          setTimeout(async () =>{
             const response =  await getTeamMembers(payload)
             setSearchData(response.data.data)
             
          },2000)
      } catch (error) {
        setSearchData([])
          // console.log(error)
      }
    }
    const handleSelect = (value) => {
      setSelectedMember(value)
      setShowAddUserModal(true)
    };
    const handleCancelAddUser = () => {
      setSelectedMember(null)
      setShowAddUserModal(false)
    } 
    const handleCancelDeleteTask = () => {
      setSelectedMember(null)
      setShowDeleteModal(false)
    }
    return (
        <>
        {contextHolder}
        {!loader && <div className="p-2 lg:flex h-screen">
          <div className="lg:w-2/3 lg:mr-2 bg-white rounded-lg shadow-lg p-2">
              <div className="float-right flex w-full justify-between mb-5">
              <Tooltip color="blue" title="Project Detail">
                <Button className="bg-blue-500 text-white" onClick={() => navigate(`/project/${projectId}`)}>
                  Project
                </Button>
              </Tooltip>     
              <Logs />
              <Tooltip  color={TaskStatusColor(task).color} title={TaskStatusColor(task).text}>
                <Button className={`${TaskStatusColor(task).backGroundColor} flex items-center`}
                  onClick={handleStatusChange}
                >{task.status} <CaretRightOutlined/></Button>
              </Tooltip>
              </div>
              <div className="mt-5">
                <p>Task: {task.task} </p>
                <p>Description: {task.description} </p>
              </div>
            <div className='flex justify-evenly my-5'>
              <CustomeDate borderColor="border-blue-800" title="Start Date" color="text-blue-500" date={task.startDate} />
              <CustomeDate borderColor="border-yellow-500" title="Due Date" color="text-yellow-500" date={task.endDate}/>
            </div>
            <div>
              
          <Select onChange={onSearch} 
            showSearch
            style={{ width: 400 }}
            onSearch={onSearch}
            onSelect={handleSelect}
            placeholder="Input Email or Name of Team Member"
            optionFilterProp="children"
            filterOption={(input, option) =>
                (option?.label ?? '').toLowerCase().includes(input.toLowerCase() || "")
            }
            options={searchData.map(member => (
                {
                    value: member.id,
                    label: `${member?.user.email} ${member?.user.firstName} ${member?.user.lastName}`
                }
            ))}
            />
            </div>
            <TeamTable />
          </div>
          <div className='lg:w-1/3'>
               {!loader && <CommentBox/>}
            </div>
        </div>}
        <Modal title="Delete Task" open={showDeleteModal} onCancel={handleCancelDeleteTask}
            footer={null}>
            <Form onFinish={handleDeleteTask}>
            <p className='text-red-700 mb-2'>Are you sure to delete this Task?</p>
              <Button  htmlType='submit' danger type='primary'>Confirm</Button>
            </Form>
        </Modal>
        <Modal title="Confirm" open={showAddUserModal} onCancel={handleCancelAddUser}
            footer={null}>
            <Form onFinish={addUser}>
            <p >Confirm to Assign Member to this Task?</p>
              <Button  htmlType='submit' danger type='primary'>Confirm</Button>
            </Form>
        </Modal>    
        </>
      )
}
