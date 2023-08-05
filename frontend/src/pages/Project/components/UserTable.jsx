/* eslint-disable react/prop-types */
import { Button, Modal,Select, Table, Tag, message } from 'antd';
import { useContext, useState } from 'react';
import { PageContext } from '../../../lib/context';
import { deleteTeamMember, updateTeamMember } from '../../../lib/api';
const { Column } = Table;

export const UserTable = ({data = []}) => {
    const {roles, projectId, fetchTeam, fetchTasks} = useContext(PageContext)
    const [showModal, setShowModal] = useState(false)
    const [selectedData, setSelectedData] = useState(null)
    const [selectedRoleForEdit, setSelectedRoleForEdit] = useState()
    const [messageAPI, contextHolder] = message.useMessage()

    const handleRoleChange = (e) => {
      setSelectedRoleForEdit(e)
    }

    const showMessage = (type, content) => {
      messageAPI.open({
        type,
        content,
      })
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
          await fetchTasks()
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
    const items = data.map((data) => (
        {
            key: data.id,
            name: `${data.user.firstName} ${data.user.lastName}`,
            role: (<Tag>{data?.role?.name }</Tag>),
            action: <>
            <Button onClick={() => handleShowModal(data.id, "Remove")}>Remove</Button>
            <Button onClick={() => handleShowModal(data.id, "Edit")}>Edit Role</Button>
            </>

        }
    ))
  return (
    <>
    {contextHolder}
      <Table dataSource={items}>
      <Column title="User" dataIndex="name" key="name" />
      <Column
        title="Role"
        dataIndex="role"
        key="role"
      />
      <Column title="Action" dataIndex="action" key="action" />
    </Table>
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
