import { useContext, useState } from 'react'
import { PageContext } from '../../lib/context'
import Search from 'antd/es/input/Search'
import { Button, Checkbox, Col, DatePicker, Drawer, Form, Input, Modal, Progress, Row, Select, Table, Tooltip } from 'antd'
import { SearchBar } from './components/SearchBar'
import { RoleTable } from './components/RoleTable'
import { UserTable } from './components/UserTable'
import { CustomeDate } from '../../components/CustomeDate'
import {
  DeleteOutlined
} from '@ant-design/icons';
import { TaskList } from '../../components/TaskList'

export const ProjectView = () => {
  const {contextHolder, loader, project, showModal, handleCancel, isModalOpen, handleSubmitTask,
          isModalOpenDelete, showDeleteModal, handleDeleteCancel, handleDeleteProject, disabledDate,
          open, showDrawer, onClose, roles, team, 
          roleInput, onChangePermission, showRoleModal, handleOkRoleModal, handleShowRoleModal,
          handleCancelRoleModal, allPermission
          } = useContext(PageContext)
  
  const [selectedUserForTask, setSelectedUserForTask] = useState([])
  const { RangePicker } = DatePicker;
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
        <div className='xl:flex xl:w-full xl:h-full'>
          <div className='sm:hidden bottom-200 left-2  m-2 flex justify-between items-center'>
              <Search />
              <Button className='w-8/12 border-2 text-slate-50 hover:text-black bg-blue-500'  onClick={showModal}>Create Task</Button>
              <Button className='w-8/12 border-2 text-slate-50 hover:text-black bg-red-500'  onClick={showDrawer}>Project Setting</Button>
          </div>
          <div className='xl:w-1/3 font-poppins p-2'> 
            <div className=''>
              <h2>Title: {project.name}</h2>
              <p>Description:</p>
              <p className=''>{project.description}</p>
              <p>Date:</p>
              <div className='flex w-full justify-between'>
                <CustomeDate borderColor="border-blue-800" title="Start Date" color="text-blue-500" date={project.startDate} />
                <CustomeDate borderColor="border-yellow-500" title="Due Date" color="text-yellow-500" date={project.endDate}/>
              </div>
              <Tooltip className='flex my-4 justify-center items-center' title={`${project.progress} %`} placement="right">
                <p className='text-left '>Progress</p>
                <Progress className='w-3/4 ml-2 my-auto' percent={project.progress}/>
              </Tooltip>
            </div>
          </div>
          <div className='m-2 xl:w-2/3 xl:h-full'>
            <div className='hidden bottom-200 left-2  sm:flex justify-between items-center'>
              <Search />
              <Button className='w-8/12 border-2 text-slate-50 hover:text-black bg-blue-500'  onClick={showModal}>Create Task</Button>
              <Button className='w-8/12 border-2 text-slate-50 hover:text-black bg-red-500'  onClick={showDrawer}>Project Setting</Button>
          </div>
          {!loader && <div className=' md:grid-cols-3 md:mt-2 grid grid-cols-1 gap-3 rounded-lg font-poppins h-fit' >
            <div className='bg-white rounded-t-lg'>
              <h3 className='text-center font-bold mt-2'>To Do Tasks</h3>
              <TaskList title={"TO DO"}/>
            </div>
            <div className='bg-white rounded-t-lg'>
              <h3 className='text-center font-bold mt-2'>In Progress Tasks</h3>
              <TaskList title={"IN PROGRESS"}/>
            </div>
            <div className='bg-white rounded-t-lg'>
              <h3 className='text-center font-bold mt-2'>Complete Tasks</h3>
              <TaskList title={"COMPLETED"}/>
            </div>
          </div>}
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
                  options={team?.map(item => (
                    {
                        value: item.user.id,
                        label: `${item.user.firstName} ${item.user.lastName} - ${item?.role?.name}`
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
      <Modal
              title="Create Role"
              open={showRoleModal}
              onOk={handleOkRoleModal}
              onCancel={handleCancelRoleModal}
              okType="default"
              okText="Add Role"
            >
              <div>  
                  <input className="w-full h-8 text-lg mb-2 border-blue-200 border-2 rounded-md" placeholder="Role Name" ref={roleInput}/>
                <Checkbox.Group
                      style={{
                        width: '100%',
                      }}
                      onChange={onChangePermission}
                    >
                      <Row>
                        {allPermission?.map((temp, index) =>
                          (
                            <Col span={8} key={index}>
                              <Checkbox value={temp.id}>{temp.name}</Checkbox>
                            </Col>
                          )
                        )}
                      </Row>
                    </Checkbox.Group>
              </div> 
      </Modal>
      <Drawer title="Project Setting" width={800} placement="right" onClose={onClose} open={open}>
          <div className='flex justify-between mb-2'>
          <SearchBar />
          </div>
        <h2 className='text-center uppercase'>Team</h2>
        {!loader && <UserTable data={team} />}
        <h2 className='text-center uppercase'>Roles</h2>
        
        <Button className='float-right' onClick={handleShowRoleModal}>Create Role</Button>
        {!loader && <RoleTable data={roles} />}
        <Tooltip title="This Will Delete All the tasks and projet" color='red'>
          <Button className='w-full flex items-center justify-center' type='primary' danger onClick={showDeleteModal}> <DeleteOutlined /> Delete Project</Button>
        </Tooltip>
      </Drawer>
      </div>
  )
}