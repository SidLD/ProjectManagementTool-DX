import { useContext, useState } from 'react'
import { PageContext } from '../../lib/context'
import Search from 'antd/es/input/Search'
import { Button,DatePicker, Drawer, Form, Input, Modal, Select, Table, Tooltip } from 'antd'

import { TaskList } from '../../components/TaskList'
import { ProjectDetail } from './components/ProjectDetail'
import { ProjectSetting } from './components/ProjectSetting'
import { DragDropContext } from 'react-beautiful-dnd'

export const ProjectView = () => {
  const {contextHolder, loader, submitTask,
          disabledDate, team, fetchList, onDragEnd, taskList, userPermission
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

  const hanldeSubmitQuery = async (e) => {
    if(e.trim() === ""){
      await fetchList({})
    }else{
      console.log(e)
      await fetchList(e)
    }

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
              <Search className='w-1/4' onSearch={hanldeSubmitQuery} />
              {userPermission.includes('VIEW-PROJECT') && <>
                <div>
                {userPermission.includes('EDIT-PROJECT') && <Tooltip color='blue' placement='left' title="Create Task">
                    <Button 
                      className='border-none'  
                      onClick={() => setShowModal(true)}>
                      <svg className="hover:scale-125  h-5 w-5 text-blue-500"  fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                      </svg>
                    </Button>
                  </Tooltip>}

                <Button className='border-none'  onClick={showDrawer}>
                  <Tooltip color='blue' placement='left' title="Project Detail">
                  <svg className="hover:scale-125  h-5 w-5 text-blue-500"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  strokeWidth="2"  strokeLinecap="round"  strokeLinejoin="round">  <circle cx="12" cy="12" r="3" />  <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" /></svg>                
                  </Tooltip>
                </Button>
              </div>
              </>}
          </div>
          <div className='w-full'>
            {!loader && <div className='m-2 lg:grid-cols-3 md:grid-cols-2 md:mt-2 grid grid-cols-1 gap-3 rounded-lg font-poppins h-fit' >
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
                columns={selectedUserTaskTableColumn} pagination={false}/>}
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