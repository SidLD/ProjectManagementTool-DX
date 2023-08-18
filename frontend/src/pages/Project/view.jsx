import { useContext, useState } from 'react'
import { PageContext } from '../../lib/context'
import Search from 'antd/es/input/Search'
import { Button,DatePicker, Drawer, Form, Input, Modal, Select, Table } from 'antd'

import { TaskList } from '../../components/TaskList'
import { ProjectDetail } from './components/ProjectDetail'
import { ProjectSetting } from './components/ProjectSetting'
import { DragDropContext } from 'react-beautiful-dnd'

export const ProjectView = () => {
  const {contextHolder, loader, submitTask,
          disabledDate, team, handleQueryChange, onDragEnd, taskList, userPermission
          } = useContext(PageContext)
  const [open, setOpen] = useState(false);
  const [showModal, setShowModal] = useState(false)
  const [selectedMemberForTask, setSelectectedMemberForTask] = useState([])
  const { RangePicker } = DatePicker;

  const showDrawer = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };
  const removeMember = (id) => {
    setSelectectedMemberForTask(selectedMemberForTask.map(member => member.id !== id))
  }

  const handleTaskFormOnSubmit = (e) => {
    if(submitTask({...e, selectedMemberForTask})) {
      setShowModal(false)
    }
  }
  
  //Didi guinKuha ko an team sa index tapos guinBiling ko an data based sa member ID na guinPasa tikang sa Select Search
  const handleMemberForTask = (e) => {
    const selectedMember = team?.filter(member => member.id === e)
    setSelectectedMemberForTask([...selectedMemberForTask, {
      key: selectedMember[0]?.id,
      id: selectedMember[0]?.id,
      name: `${selectedMember[0]?.user.firstName} ${selectedMember[0]?.user.lastName}`,
      role: selectedMember[0]?.role.name,
      action: (<Button onClick={() => removeMember(selectedMember[0]?.id)}>Remove</Button>)
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
        <div className='flex-row xl:w-full xl:h-full'>
          <div className='bottom-200 left-2  m-2 flex justify-between gap-x-2 items-center'>
              <Search className='w-1/4' onSearch={handleQueryChange} />
              {userPermission.includes('VIEW-PROJECT') && <>
              {userPermission.includes('EDIT-PROJECT') &&  <Button 
                className='w-8/12 border-2 text-slate-50 hover:text-black bg-blue-500'  
                onClick={() => setShowModal(true)}>Create Task</Button>}

              <Button className='w-1/4 border-2 text-slate-50 hover:text-black bg-red-500'  onClick={showDrawer}>Project Detail</Button>
              </>}
          </div>
          <div className='w-full'>
            {!loader && <div className='m-2 md:grid-cols-3 md:mt-2 grid grid-cols-1 gap-3 rounded-lg font-poppins h-fit' >
              <DragDropContext
                onDragEnd={onDragEnd} >
                  { taskList.map(({title, tasks}) => {
                      return <TaskList key={title} title={title} tasks={tasks}/>
                    })
                  }
              </DragDropContext>
          </div>}
        </div>
      </div>
      <Modal title="Create Task" open={showModal} onCancel={() => setShowModal(false)} footer={null}>
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
                  onSelect={handleMemberForTask}
                  options={team?.map(item => (
                    {
                        value: item.id,
                        label: `${item.user.firstName} ${item.user.lastName} - ${item?.role?.name}`
                    }
                ))}
                />}
              </Form.Item>
              {selectedMemberForTask.length >= 1 && <Table 
                dataSource={selectedMemberForTask} 
                columns={selectedUserTaskTableColumn}/>}
          </div>
          <Button className='flex justify-center' htmlType='submit'>Submit</Button>
          </Form>
      </Modal>
      <Drawer className='dark:bg-slate-900 dark:text-slate-200'  title="Project Detail" width={620} closable={false} onClose={onClose} open={open}>
        <Button className='float-right md:hidden' onClick={onClose}>X</Button>
          <ProjectDetail /> 
          <ProjectSetting />
      </Drawer>
      </div>
  )
}