/* eslint-disable react/prop-types */
import { Button, Checkbox, Col, Input, Modal, Row, Table, Tag } from 'antd';
import { useContext, useEffect, useState } from 'react';
import { getAllPermission } from '../../../lib/api';
import { PageContext } from '../../../lib/context';
const { Column } = Table;

export const RoleTable = ({data = []}) => {
    const {handleUpdateRole, handleRemoveRole} = useContext(PageContext)
    const [selectedRole, setSelectedRole] = useState(null)
    const [permissions, setPermission] = useState([])
    const [selectedPermission, setSelectedPermission] = useState([]) 
    const [showModal, setShowModal] = useState(false)
    const [detail, setDetail] = useState()
    const [inputName, setInputName] = useState()
    const onChangePermission = (e) => {
      setSelectedPermission(e)
    }
    const handleInputChange = (e) => {
      setInputName(e.target.value)
    } 
    const handleSelectRole = (id, currentPermission, type, d) => {
      setInputName(d)
      setSelectedRole({
        id,
        currentPermission,
        type
      })
      setSelectedPermission(currentPermission)
      if(type === "remove"){
        setDetail(
          <h2 className='text-red-500'>
            *Please Make Sure no Member are associated <br/> with this Role before Deleting
          </h2>
        )
      }else{
        setDetail(
          <>
          <div className='w-4/5 mb-2'>
            <Input  value={inputName} onChange={handleInputChange}/>
          </div>
          <Checkbox.Group
             style={{
               width: '100%',
             }}
             onChange={onChangePermission}
             defaultValue={currentPermission}
           >
             <Row>
               {permissions?.map((temp, index) =>(
                     <Col span={8} key={index}>
                       <Checkbox value={temp.id}  checked>{temp.name}</Checkbox>         
                     </Col>
                   )
               )}
             </Row>
            </Checkbox.Group>
            </>
        )
      }
      setShowModal(true)
    }
    const saveRemoveRole = () => {
      handleRemoveRole(selectedRole)
    }
    const saveEditRole = () => {
      handleUpdateRole({
        newName: inputName,
        roleId: selectedRole,
        newPermissions: selectedPermission
      })
    }
    const handleOk = () => {
      if(selectedRole.type === "remove"){
        saveRemoveRole()
      }else{
        saveEditRole()
      }
      setShowModal(false)
    }
    const handleCancel = () => {
      setSelectedRole(null)
      setSelectedPermission([])
      setShowModal(false)
    }
    const items = data.map((data) => (
        {
            key: data.id,
            name: data.name,
            permissions: (
              <div className='grid-col-2'>
                {[data?.role_permissions.map((permission) => {
                  let color = "blue"
                  if(permission.name.includes('DELETE')){
                    color = "red"
                  }
                  return (<Tag color={color} key={permission.id}>{permission.name}</Tag>)
                }
                )]}
              </div>
            ),
            action: <>
            <Button onClick={() => 
              handleSelectRole(data.id, data?.role_permissions.map(perId => perId.id),"remove", data.name)}>Remove</Button>
            <Button onClick={() => 
              handleSelectRole(data.id, data?.role_permissions.map(perId => perId.id),"edit"  , data.name)}>Edit Permissions</Button>
            </>

        }
    ))
    useEffect(() => {
      const getPermission = async () => {
        try {
          const response = await getAllPermission()
          setPermission(response.data.data)
        } catch (error) {
          setPermission([])
        }
      }
      
    getPermission()
    }, [])
  return (
    <>
    <Table dataSource={items}>
      <Column title="Role" dataIndex="name" key="name" />
      <Column
        title="Permissions"
        dataIndex="permissions"
        key="permissions"
      />
      <Column title="Action" dataIndex="action" key="action" />
    </Table>
      <Modal open={showModal} onCancel={handleCancel} footer={null}>
          {detail}
          <Button onClick={handleOk}>Submit</Button>
      </Modal>
    </>
  )
}
