/* eslint-disable react/prop-types */
import { Avatar, Badge, Button, Modal,Select, Table, Tag, Tooltip } from 'antd';
import { useContext, useState } from 'react';
import { PageContext } from '../../../lib/context';
import { deleteTeamMember, updateTeamMember } from '../../../lib/api';
const { Column } = Table;

export const UserTable = () => {
    const {roles, team, projectId, fetchTeam, fetchList, showMessage, userPermission} = useContext(PageContext)
    const [showModal, setShowModal] = useState(false)
    const [selectedData, setSelectedData] = useState(null)
    const [selectedRoleForEdit, setSelectedRoleForEdit] = useState()
    const [currentPage, setCurrentPage] = useState(1);
    const [postsPerPage] = useState(2) 
    const handleRoleChange = (e) => {
      setSelectedRoleForEdit(e)
    }
    const handleShowModal = (id, type) => {
      setShowModal(true)
      setSelectedData({id, type})
    }
    const handleCancel = () => {
      setShowModal(false)
    }
    const saveRemoveMember = async () => {
      try {
        const payload = {
          memberId: selectedData.id
        }
        const response = await deleteTeamMember(projectId, payload)
        if(response.data.ok){
          setSelectedData(null)
          setSelectedRoleForEdit(null)
          showMessage('success', 'Success')
          setShowModal(false) 
          await fetchTeam()
          await fetchList()
        }
      } catch (error) {
        showMessage('warning', error.response.data.message)
      }
    }
    const saveEditRole = async () => {
      if(selectedRoleForEdit) { 
        try {
          const payload = {
            roleId: selectedRoleForEdit
          }
          const response = await updateTeamMember(projectId,selectedData.id, payload)
          if(response.data.ok) {
            await fetchTeam()
            setSelectedData(null)
            setSelectedRoleForEdit(null)
            showMessage('success', 'Success')
            setShowModal(false)
          }else{
            showMessage('warning', 'Something Went Wrong')
          }
        } catch (error) {
          showMessage('warning', error.response.data.message)
        }
      }else{
        showMessage('warning', 'Please Select Role')
      }
    }
    const onNextPage = async () => {
      await fetchTeam({
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
        await fetchTeam({
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
    const items = team.map((data) => (
        {
            key: data.id,
            name: <div>
                <Tooltip title={data.isActive ? 'online': 'offline'}>
                  <Badge dot status={data.isActive ? 'success': 'default'} className='mr-2'> 
                    <Avatar shape="square">{`${data.user.firstName}`}</Avatar>
                  </Badge>
                </Tooltip>
                <span>{`${data.user.firstName} ${data.user.lastName}`}</span>
            </div>,
            role: (<Tag>{data?.role?.name }</Tag>),
            action: <div className='flex justify-end'>
              <Tooltip  color='red' title={`Remove ${data.user.firstName} ${data.user.lastName}`}>
                <Button onClick={() => handleShowModal(data.id, "Remove")}>
                    <svg className="h-4 w-4 text-red-500"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  strokeWidth="2"  strokeLinecap="round"  strokeLinejoin="round">  <polyline points="3 6 5 6 21 6" />  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />  <line x1="10" y1="11" x2="10" y2="17" />  <line x1="14" y1="11" x2="14" y2="17" /></svg>      
                </Button>
              </Tooltip>
              <Tooltip  color='blue' title={`Edit ${data.user.firstName} ${data.user.lastName}`}>
                <Button onClick={() => handleShowModal(data.id, "Edit")}>
                  <svg className="h-4 w-4 text-green-500" width="24"  height="24"  viewBox="0 0 24 24"  xmlns="http://www.w3.org/2000/svg"  fill="none"  stroke="currentColor"  strokeWidth="2"  strokeLinecap="round"  strokeLinejoin="round">  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
                </Button>
              </Tooltip>
            </div>

        }
    ))

  return (
    <>
      <Table className='rounded-lg shadow-md' dataSource={items} pagination={false}>
      <Column title="User" dataIndex="name" key="name" />
      <Column
        title="Role"
        dataIndex="role"
        key="role"
      />

      {userPermission.includes('EDIT-MEMBER') && <Column title="Action" dataIndex="action" key="action" />}
    
    </Table>
    <div className='float-right my-5'>
        <Button onClick={onPrevPage} >{`<`}</Button>
        <span className='p-2'>{currentPage}</span>
        <Button onClick={onNextPage}>{`>`}</Button>
      </div>
    <Modal open={showModal} onCancel={handleCancel} footer={null}>
      {selectedData?.type?.toLowerCase() === "remove" ? 
        <>
        <h2 className='text-red-500'>Confirm Remove User</h2>
        <Button onClick={saveRemoveMember}>Save</Button>
        </>
        : 
        <>
            <h2 className=''>
              Select New Role
            </h2>
              <Select 
                style={{
                  width: 120,
                }}
                defaultValue={"Disable"}
                onSelect={handleRoleChange}
                options={roles.map(r => (
                  {value: r.id, label: r.name }
              ))}/>
              
          <Button onClick={saveEditRole}>Save</Button>
        </>}
    </Modal>
    </>
  )
}
