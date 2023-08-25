/* eslint-disable react/prop-types */
import { Button, Checkbox, Col, Input, Modal, Row, Tag, Tooltip } from 'antd';
import { useContext, useEffect, useState } from 'react';
import { PageContext } from '../../../lib/context';
import { deleteRole, updateRole } from '../../../lib/api';
import { CustomeTable } from '../../../components/CustomeTable';

export const RoleTable = () => {
    const {projectId, roles, allPermission, fetchRoles, fetchTeam, showMessage, userPermission} = useContext(PageContext)
    const [selectedRole, setSelectedRole] = useState({})
    const [showModal, setShowModal] = useState(false)
    const [currentPage, setCurrentPage] = useState(1);
    const [items, setItems] = useState([])
    const [postsPerPage] = useState(2) 

    const onChangePermission = (e) => {
      setSelectedRole({
        ...selectedRole,
        selectedPermission:e 
      })
    }

    const handleInputChange = (e) => {
      setSelectedRole({
        ...selectedRole,
        name: e.target.value
      })
    }
    
    const handleSelectRole = (name ,id, currentPermission, type) => {
      setSelectedRole({
        name: name,
        id: id,
        selectedPermission : currentPermission,
        type: type
      })
      setShowModal(true)
    }

    const saveRemoveRole = async () => {
      try {
            const payload = {
              roleId: selectedRole.id
            }
            const response = await deleteRole(projectId, payload)
            if(response.data.ok){
              showMessage('success', 'Success')
              await fetchRoles()
              await fetchTeam()
            }
          } catch (error) {
            console.log(error)
            showMessage('warning', error.response.data.message)
          }
    }

    const saveEditRole = async () => {
      try {
            const payload = {
              name: selectedRole.name,
              permissions: selectedRole.selectedPermission
            }
  
            const response = await updateRole(projectId,selectedRole.id, payload)
            if(response.data.ok){
              showMessage('success', 'Success')
              await fetchRoles({
                start: 0, 
                limit: postsPerPage,
                order: {
                  name: 'asc'
                }
              })

            }
          } catch (error) {
            console.log(error)
            showMessage('warning', error.response.data.message)
          }
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
      setSelectedRole({})
      setShowModal(false)
    }
    
    useEffect(() => {
      setItems(roles.map((data) => (
        {
            key: data.id,
            name: data.name,
            permissions: (
              <div className='grid-col-2'>
                {[data?.role_permissions.map((permission) => {
                 let color = ""
                 if(permission.name.includes("EDIT")){
                   color = "red"
                 }
                 else {
                   color = "green"
                 }
                  return (<Tag color={color} key={permission.id}>{permission.name}</Tag>)
                }
                )]}
              </div>
            ),
            action: <div className='flex justify-end'>
              <Tooltip  color='red' title={`Remove ${data.name}`}>
                <Button onClick={() => 
                  handleSelectRole(data.name, data.id, data?.role_permissions.map(perId => perId.id),"remove")}>
                    <svg className="h-4 w-4 text-red-500"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  strokeWidth="2"  strokeLinecap="round"  strokeLinejoin="round">  <polyline points="3 6 5 6 21 6" />  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />  <line x1="10" y1="11" x2="10" y2="17" />  <line x1="14" y1="11" x2="14" y2="17" /></svg>      
                </Button>
              </Tooltip>
              <Tooltip  color='blue' title={`Edit ${data.name}`}>
                <Button onClick={() => 
                  handleSelectRole(data.name, data.id, data?.role_permissions.map(perId => perId.id),"edit" )}>
                  <svg className="h-4 w-4 text-green-500" width="24"  height="24"  viewBox="0 0 24 24"  xmlns="http://www.w3.org/2000/svg"  fill="none"  stroke="currentColor"  strokeWidth="2"  strokeLinecap="round"  strokeLinejoin="round">  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
                </Button>
              </Tooltip>
            </div>
        }
    )))
    },[roles])

    const onNextPage = async () => {
      if(items.length > 0) {
        await fetchRoles({
          start: postsPerPage * currentPage, 
          limit: postsPerPage,
          order: {
            name: 'asc'
          }
        })
        setCurrentPage(currentPage + 1)
      }
    }

    const onPrevPage = async () => {
      if((postsPerPage * (currentPage - 2) > -1)){
        await fetchRoles({
          start: postsPerPage * (currentPage - 2), 
          limit: postsPerPage,
          order: {
            name: 'asc'
          }
        })
        setCurrentPage(currentPage - 1)
      }
    }

    const column = [
      {
        title: 'Role',
        isShow: true,
        index: 'name'
      },
      {
        title: 'Permissions',
        index: 'permissions',
        isShow: true,
      },
      {
        title: 'Action',
        index: 'action',
        isShow: userPermission.includes('EDIT-ROLE')
      }
    ]

  return (
    <>
    <CustomeTable column={column}  dataSource={items} />

      <div className='flex w-full justify-end h-11 my-5'>
        <div className='rounded-full p-[1px] border-blue-500 border-[1px]'>
          <Button className='h-10 border-none bg-blue-500 rounded-full text-white' onClick={onPrevPage} >{`<`}</Button>
            <span className='p-2'>{currentPage}</span>
          <Button className='h-10 border-none bg-blue-500 rounded-full' onClick={onNextPage}>{`>`}</Button>
        </div>
      </div>

      <Modal open={showModal} destroyOnClose={true} onCancel={handleCancel} footer={null}>
          {selectedRole.type == "edit" ? <>
              <div className='w-4/5 mb-2'>
                <Input value={selectedRole.name} onChange={handleInputChange}/>
              </div>
              <Checkbox.Group
                style={{
                  width: '100%',
                }}
                onChange={onChangePermission}
                defaultValue={selectedRole?.selectedPermission}
              >
                <Row>
                  {allPermission?.map((temp, index) =>(
                        <Col span={8} key={index}>
                          <Checkbox value={temp.id}  checked>{temp.name}</Checkbox>         
                        </Col>
                      )
                  )}
                </Row>
              </Checkbox.Group>
            </>
          :
          <h2 className='text-red-500'>
            *Please Make Sure no Member are associated <br/> with this Role before Deleting
          </h2>
          }
          <Button onClick={handleOk}>Submit</Button>
      </Modal>
    </>
  )
}
