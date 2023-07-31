import { useContext, useState } from 'react'
import { PageContext } from '../../lib/context'
import {TaskList} from '../../components/TaskList'
import Search from 'antd/es/input/Search'
import { Button, DatePicker, Drawer, Form, Input, Modal, Progress, Select, Table, Tooltip } from 'antd'
import { SearchBar } from './components/SearchBar'
import { RoleTable } from './components/RoleTable'
import { UserTable } from './components/UserTable'
import { CustomeDate } from '../../components/CustomeDate'
import {
  DeleteOutlined
} from '@ant-design/icons';

export const ProjectView = () => {
  const {contextHolder, loader, project, showModal, handleCancel, isModalOpen, handleSubmitTask,
          isModalOpenDelete, showDeleteModal, handleDeleteCancel, handleDeleteProject, disabledDate,
          open, showDrawer, onClose, roles, team,
          tasks} = useContext(PageContext)
  
  const [selectedUserForTask, setSelectedUserForTask] = useState([])
  const { RangePicker } = DatePicker;
  const filterData = (data = [], status) => {
    return data.filter(temp => temp.status === status)
  }
  const removeUserForTask = (id) => {
    setSelectedUserForTask(selectedUserForTask.map(user => user.user.id !== id))
  }
  const handleTaskFormOnSubmit = (e) => {
    handleSubmitTask({...e, selectedUserForTask})
  }
  const handleSelectUserForCreateTaskSelect = (e) => {
    const selectedUser = team?.filter(user => user.user.id === e)
    setSelectedUserForTask([...selectedUserForTask, {
      key: selectedUser[0]?.user.id,
      name: `${selectedUser[0]?.user.firstName} ${selectedUser[0]?.user.lastName}`,
      role: selectedUser[0]?.role.name,
      action: (<Button onClick={() => removeUserForTask(selectedUser[0]?.user.id)}>Remove</Button>)
    }])
  }
  const selectedUserTaskTableColumn = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
    },
    {
      title: 'Action',
      dataIndex: 'action',
      key: 'action',
    },
  ];
  return (
    !loader && 
      <div >{contextHolder}
        <div className='flex h-full m-2'>
          <div className='w-1/3 text-left bg-slate-50 shadow-md p-2 rounded-3xl'> 
            <div className='h-1/4'>
              <h2>Title: {project.name}</h2>
              <p>Description:</p>
              <p className='text-justify'>{project.description}</p>
              <p>Date:</p>
              <div className='flex justify-evenly '>
                <CustomeDate borderColor="border-blue-800" title="Start Date" color="text-blue-500" date={project.startDate} />
                <CustomeDate borderColor="border-yellow-500" title="Due Date" color="text-yellow-500" date={project.endDate}/>
              </div>
              <Tooltip title={`${project.progress} %`} placement="right">
                <p className='mt-2'>Progress</p>
                <Progress percent={project.progress}/>
              </Tooltip>
            </div>
          </div>
          <div className='w-2/3'>
            <div className='m-2 flex justify-between items-center'>
              <Search />
              <Button className='w-8/12 border-2 text-slate-50 hover:text-black bg-blue-500'  onClick={showModal}>Create Task</Button>
              <Button className='w-8/12 border-2 text-slate-50 hover:text-black bg-red-500'  onClick={showDrawer}>Project Setting</Button>
            </div>
            <div className='flex justify-center'>
              <div className='w-1/3 text-center'>
                  <h2 className='uppercase text-center text-slate-50 font-bold rounded-full bg-blue-500 mx-2'>To Do</h2>
                <TaskList data={filterData(tasks, "TO DO")} />
              </div>
              <div className='w-1/3 text-center'>
                <h2 className='uppercase text-center text-slate-50 font-bold rounded-full bg-yellow-500 mx-2'>In Progress</h2>
                <TaskList data={filterData(tasks, "IN PROGRESS")} />
              </div>
              <div className='w-1/3 text-center '>
              <h2 className='uppercase text-center text-slate-50 font-bold rounded-full bg-green-500 mx-2'>Completed</h2>
                <TaskList data={filterData(tasks, "COMPLETED")} />
              </div>
            </div>
          </div>
        </div>
      <Modal title="Create Task" open={isModalOpen} onCancel={handleCancel} footer={null}>
          <Form
            onFinish={handleTaskFormOnSubmit}
            >
            <Form.Item label="Task Title" name="name"
              rules={[{ required: true, message: "Please add Title" }]}>
              <Input />
            </Form.Item>
            <Form.Item label="Task Description" name="description"
              rules={[{ required: true, message: "Please add Description" }]}>
              <Input />
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
          <div className='flex-row mt-2 justify-center '>
              <Form.Item>
                {!loader && <Select
                  style={{width:200}}
                  onSelect={handleSelectUserForCreateTaskSelect}
                  options={team.map(item => (
                    {
                        value: item.user.id,
                        label: `${item.user.firstName} ${item.user.lastName} - ${item.role.name}`
                    }
                ))}
                />}
              </Form.Item>
              {selectedUserForTask.length >= 1 && <Table 
                dataSource={selectedUserForTask} 
                columns={selectedUserTaskTableColumn}/>}
          </div>
          <Button className='flex justify-center' htmlType='submit'>Submit</Button>
            
          </Form>
      </Modal>
      <Modal title="Delete Project" open={isModalOpenDelete} onCancel={handleDeleteCancel}
        footer={null}
      >
        <Form onFinish={handleDeleteProject}>
          <p className='text-red-700'>Type The Project Name to Confirm Delete this Project</p>
          <Form.Item name="name" label="Project Name" 
            rules={[{ required: true, message: "Please add Title" }]}>
            <Input />
          </Form.Item>
          <Button  htmlType='submit' danger type='primary'>Confirm</Button>
        </Form>
      </Modal>
      <Drawer title="Project Setting" width={800} placement="right" onClose={onClose} open={open}>
          <div className='flex justify-between mb-2'>
          <SearchBar />
          </div>
        <h2 className='text-center uppercase'>Team</h2>
        {!loader && <UserTable data={team} />}
        <h2 className='text-center uppercase'>Roles</h2>
        
        <Button className='float-right '>Create Role</Button>
        {!loader && <RoleTable data={roles} />}
        <Tooltip title="This Will Delete All the tasks and projet" color='red'>
          <Button className='w-full flex items-center justify-center' type='primary' danger onClick={showDeleteModal}> <DeleteOutlined /> Delete Project</Button>
        </Tooltip>
      </Drawer>
      </div>
  )
}