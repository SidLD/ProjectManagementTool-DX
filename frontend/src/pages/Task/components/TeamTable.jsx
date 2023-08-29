import { Avatar, Badge, Button, Form, Modal, Tooltip } from 'antd'
import { useState } from 'react'
import { getTeamMembers } from '../../../lib/api'
import { useEffect } from 'react'
import { useContext } from 'react'
import { PageContext } from '../../../lib/context'
import {CustomeTable} from '../../../components/CustomeTable'

export const TeamTable = () => {
    const {task, handleRemoveUser, userPermission, taskId} = useContext(PageContext)
    const [members, setMembers] = useState([])
    const [currentPage, setCurrentPage] = useState(1);
    const [postsPerPage] = useState(2) 
    const [selectMember, setSelectMember] = useState()
    const [showModal, setShowModal] = useState(false)

    const handleSelect = (memberId) => {
      setSelectMember(memberId)
      setShowModal(true)
    }

    const handleCancel = () => {
      setSelectMember(null)
      setShowModal(false)
    }

    const removeUser = async () => {
      const isSuccess = await handleRemoveUser(selectMember)
      if(isSuccess){
        setShowModal(false)
      }
    }

    const getTaskMember = async (data) => {
        try {
            const payload = {
                ...data,
                team_tasks: {
                    some: {
                        id: taskId
                    }
                },
                projectId: task?.project?.id, 
              }
            const response = await getTeamMembers(payload)
            setMembers(
              response.data.data.map(member => ({
                key:member.user.id,
                name: <>
                        <Tooltip title={member?.user.isActive ? 'online': 'offline'}>
                          <Badge dot status={member?.user.isActive  ? 'success': 'default'} className='mr-2'> 
                            <Avatar shape="square">{`${member?.user.firstName}`}</Avatar>
                          </Badge>
                        </Tooltip>
                        <span>{`${member?.user.firstName} ${member?.user.lastName}`}</span>
                      </>,
                role: member?.role.name,
                action: <div className='flex justify-center w-full items-center'>
                    <Button className='border-red-500 dark:text-white text-center flex justify-center items-center' onClick={() => handleSelect(member.id)}>
                      <svg className="h-4 w-4 text-red-500 mr-1"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  strokeWidth="2"  strokeLinecap="round"  strokeLinejoin="round">  <polyline points="3 6 5 6 21 6" />  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />  <line x1="10" y1="11" x2="10" y2="17" />  <line x1="14" y1="11" x2="14" y2="17" /></svg>      
                      Remove
                    </Button>
                </div>
              })))
        } catch (error) {
            console.log(error)
        }
    }

    const onNextPage = async () => {
      if(members.length > 0) {
        await getTaskMember({
          start: postsPerPage * currentPage, 
          limit: postsPerPage,
          order: {
            user: {
              firstName: 'asc'
            }
          }
        })
        setCurrentPage(currentPage + 1)
      }
    }

    const onPrevPage = async () => {
      if((postsPerPage * (currentPage - 2) > -1)){
        await getTaskMember({
          start: postsPerPage * (currentPage - 2), 
          limit: postsPerPage,
          order: {
            user: {
              firstName: 'asc'
            }
          }
        })
        setCurrentPage(currentPage - 1)
      }
    }

    const column = [
      {
        title: 'Username',
        index: 'name',
        isShow: true,
      },
      {
        title: 'Role',
        index: 'role',
        isShow: true,
      },
      {
        title: 'Action',
        index: 'action',
        isShow: userPermission.includes('EDIT-MEMBER')
      }
    ]


    useEffect(() => {
      getTaskMember()
    },[task])
    
  return (
    <>
      <CustomeTable column={column} dataSource={members} />

      <div className='flex w-full justify-end h-11 my-5'>
        <div className='rounded-full p-[1px] border-blue-500 border-[1px]'>
          <Button className='h-10 border-none bg-blue-500 rounded-full text-white' onClick={onPrevPage} >{`<`}</Button>
            <span className='p-2'>{currentPage}</span>
          <Button className='h-10 border-none bg-blue-500 rounded-full' onClick={onNextPage}>{`>`}</Button>
        </div>
      </div>

      <Modal open={showModal} onCancel={handleCancel} footer={null}>
        <Form onFinish={removeUser}>
            <p className='text-red-700 mb-2'>Are you sure to remove this user?</p>
              <Button  htmlType='submit' danger type='primary'>Confirm</Button>
            </Form>
      </Modal>
    </>
  )
}
