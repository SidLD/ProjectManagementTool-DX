import { Avatar, Badge, Button, Form, Modal, Table, Tooltip } from 'antd'
import { useState } from 'react'
import { getTeamMembers } from '../../../lib/api'
import { useEffect } from 'react'
import { useContext } from 'react'
import { PageContext } from '../../../lib/context'
import Column from 'antd/es/table/Column'
export const TeamTable = () => {
    const {task, handleRemoveUser, userPermission} = useContext(PageContext)
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
                        id: task?.id
                    }
                },
                projectId: task?.project?.id, 
              }
            const response = await getTeamMembers(payload)
            setMembers(response.data.data)
        } catch (error) {
            console.log(error)
        }
    }

    const onNextPage = async () => {
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

    const items = members?.map(member => ({
      key:member.user.id,
      name: <div>
      <Tooltip title={member?.user.isActive ? 'online': 'offline'}>
        <Badge dot status={member?.user.isActive  ? 'success': 'default'} className='mr-2'> 
          <Avatar shape="square">{`${member?.user.firstName}`}</Avatar>
        </Badge>
      </Tooltip>
      <span>{`${member?.user.firstName} ${member?.user.lastName}`}</span>
    </div>,
      role: member?.role.name,
      action: <>
          <Button onClick={() => handleSelect(member.id)}>Remove</Button>
      </>
    }))

    useEffect(() => {
        getTaskMember()
    },[task])
    
  return (
    <div>
      <Table className='rounded-lg shadow-md' dataSource={items} pagination={false}>
        <Column title="Name" dataIndex="name" key="name" />
        <Column
          title="Role"
          dataIndex="role"
          key="role"
        />
      {userPermission.includes('EDIT-PROJECT') && <Column title="Action" dataIndex="action" key="action" />}
    
      </Table>
        <div className='float-right my-5'>
        <Button onClick={onPrevPage} >{`<`}</Button>
        <span className='p-2'>{currentPage}</span>
        <Button onClick={onNextPage}>{`>`}</Button>
      </div>
      <Modal open={showModal} onCancel={handleCancel} footer={null}>
        <Form onFinish={removeUser}>
            <p className='text-red-700 mb-2'>Are you sure to remove this user?</p>
              <Button  htmlType='submit' danger type='primary'>Confirm</Button>
            </Form>
      </Modal>
    </div>
  )
}
