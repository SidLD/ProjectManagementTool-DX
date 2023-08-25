
import { useContext, useState } from 'react';
import { PageContext } from '../../../lib/context';
import { TaskStatusColor } from '../../../lib/helper';
import { CustomeDate } from '../../../components/CustomeDate';
import {CommentBox}  from '../components/CommentBox'
import {Button, Tooltip, Modal, Form, Select, Input, DatePicker } from 'antd';
import {
    CaretRightOutlined,
} from '@ant-design/icons';
import { Logs } from '../components/Logs';
import { TeamTable } from '../components/TeamTable';
import { getTeamMembers } from '../../../lib/api';
import TextArea from 'antd/es/input/TextArea';
import dayjs from 'dayjs';
export const TaskDetailView = () => {
    const {
        handleDeleteTask, 
        contextHolder, 
        loader, 
        task, 
        navigate, 
        projectId, 
        handleStatusChange,
        handleAddUser,
        userPermission,
        handleSaveEdit,
        disabledDate
    } = useContext(PageContext)
    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [showAddUserModal, setShowAddUserModal] = useState(false)
    const [searchData, setSearchData] = useState([])
    const [selectedMember, setSelectedMember] = useState()
    const [show, setShow] = useState(false)
    const {RangePicker} = DatePicker

    const addUser = async () => {
     const isSuccess = await handleAddUser(selectedMember)
     if(isSuccess) {
      setShowAddUserModal(!showAddUserModal);
     }
    }
    
    const handleFinishEdit = async(e) => {
      if(await handleSaveEdit(e)){
        setShow(false)
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
        {!loader && <div className="p-2 lg:flex ">
          <div className="dark:bg-slate-900 dark:text-slate-200 lg:w-2/3 lg:mr-2 h-full bg-white rounded-lg shadow-lg p-2">
              <div className="float-right flex w-full justify-between mb-5">
                <div className='flex'>
                  <Tooltip color="blue" title="Project Detail">
                    <Button className="hover:scale-110 hover:shadow-md flex border-none justify-center text-center items-center" onClick={() => navigate(`/project/${projectId}`)}>
                      <svg className="h-8 w-8 text-blue-500"  width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">  <path stroke="none" d="M0 0h24v24H0z"/>  <rect x="4" y="4" width="16" height="16" rx="2" />  <path d="M9 16v-8h4a2 2 0 0 1 0 4h-4" /></svg>
                    </Button>
                  </Tooltip> 
                <Logs />

                {userPermission.includes('EDIT-PROJECT') && <Button className='float-right border-none hover:scale-125' 
                    onClick={() => setShow(true)}>
                    <Tooltip title="Edit Project Detail">
                        <svg className="h-6 w-6 text-red-500" width="24"  height="24"  viewBox="0 0 24 24"  xmlns="http://www.w3.org/2000/svg"  fill="none"  stroke="currentColor"  strokeWidth="2"  strokeLinecap="round"  strokeLinejoin="round">  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
                    </Tooltip>
                </Button>}

                </div>
                <Tooltip color="green" 
                  className='flex justify-center items-center cursor-pointer hover:scale-110 delay-300 ease-in-out'  
                  title={TaskStatusColor(task).text}>

                  <span className={`font-bold text-center text-black  font-poppins p-1 ${TaskStatusColor(task).backGroundColor}  rounded-md`}>
                    {task?.status?.replace('_', ' ')} 
                  </span>
                  <Button className={`border-none p-1 h-7 ${TaskStatusColor(task).backGroundColor} rounded-md ml-2 flex justify-center items-center`} onClick={handleStatusChange} >
                    <CaretRightOutlined/>
                  </Button>
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
              
            {userPermission.includes('EDIT-PROJECT') && 
            <Select 
            className='my-2 text-black'
            onChange={onSearch} 
            showSearch
            onSearch={onSearch}
            onSelect={handleSelect}
            placeholder="Input Email or Name of Team Member to assign to this Task"
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
            />}
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
        <Modal title="Edit Project Detail" open={show} onCancel={() => setShow(false)} footer={null}>
    <Form
        labelCol={{
            span: 5,
        }}
        wrapperCol={{
            span: 16,
        }}
        initialValues={
            {
                'name': task.task,
                'description':task.description,
                'startEndTime':[dayjs(task.startDate) , dayjs( task.endDate)]
            }
        }
        layout="horizontal"
        onFinish={handleFinishEdit}
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
        <Form.Item label="Description" name="description"
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
          disabledDate={disabledDate}
            showTime={{
            hideDisabledOptions: true,
            }}
            format="YYYY-MM-DD hh:mm a"
            style={{ width: "100%" }}
        />
        </Form.Item>
        <Button className="w-full bg-blue-500 hover:text-slate-50" htmlType="submit">Save Task</Button>
        </Form>
    </Modal>  
        </>
      )
}
