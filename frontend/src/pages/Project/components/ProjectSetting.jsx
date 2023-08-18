import { useContext, useRef, useState } from 'react'
import { SearchBar } from './SearchUserBar'
import { PageContext } from '../../../lib/context'
import { UserTable } from './UserTable'
import { Button, Checkbox, Col, Form, Input, Modal, Row, Tooltip } from 'antd'
import { RoleTable } from './RoleTable'

import {
    DeleteOutlined
  } from '@ant-design/icons';
import { createRole, deleteProject } from '../../../lib/api'
export const ProjectSetting = () => {
    const {loader, project, showMessage, navigate, allPermission, fetchRoles, userPermission} = useContext(PageContext)
    const [showModal, setShowModal] = useState(false)

    const [selectedPermission, setSelectedPermission] = useState([])
    const [showRoleModal, setShowRoleModal] = useState(false)
    const roleInput = useRef()

    const handleDeleteProject = async (e) => {  
        try {
          const name = project.name
          if(name.trim() === e.name){
            const response = await deleteProject({projectId: project.id})
            if(response.data.ok){
              showMessage('success', 'Success and Redirecting')
              setTimeout(() => {
                navigate('/dashboard')
              }, 500)
            }else{
              showMessage('warning', 'Something Went Wrong')
            }
          }else{
            showMessage('warning', 'Title Does not Match')
          }
        } catch (error) {
          console.log(error.response.data)
        }
    }
    
    const handleOkRoleModal = async () => {
        if(roleInput.current.value.trim() === "" || selectedPermission.length < 1){
          showMessage('warning', 'Please Role Name & Check Permission')
        }else{
          const payload = {
            name : roleInput.current.value,
            role_permissions: selectedPermission
          }
          try {
           const response = await createRole(project.id, payload)
            if(response.data.ok){
              showMessage('success', "Success")
              setShowRoleModal(false)
              setSelectedPermission([])
              await fetchRoles({
                start: 0, 
                limit: 3,
                order: {
                  name: 'asc'
                }
              })
            }else{
              showMessage('warning', 'Something Went Wrong')
            }
          } catch (error) {
            showMessage('warning', error.response.data.message)
          }
        }
    };

    const handleShowRoleModal  = () => {
        setShowRoleModal(true)
    }

    const handleCancelRoleModal = () => {
        setShowRoleModal(false)
    }

    const onChangePermission = (e) => {
        setSelectedPermission(e)
    }

    return (
    <>
        {userPermission.includes('EDIT-MEMBER') && <div className='my-5'>
          <SearchBar />
        </div>}

        {!loader && <UserTable/>}

        {userPermission.includes('EDIT-ROLE') &&  <Button 
          className='mt-16 relative float-right  bg-yellow-400 font-bold my-5' 
          onClick={handleShowRoleModal}>Create Role</Button>
}
        {!loader && <RoleTable />}

        {userPermission.includes('DELETE-PROJECT') && <Tooltip title="This Will Delete All the tasks and projet" color='red'>
          <Button className='w-full flex items-center justify-center' type='primary' danger onClick={() => setShowModal(true)}>
            <DeleteOutlined /> Delete Project</Button>
        </Tooltip>}
        
        <Modal title="Delete Project" open={showModal} onCancel={() => setShowModal(false)}
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
                  <input className="px-2 uppercase font-poppins w-full h-8 text-lg mb-2 border-blue-200 border-2 rounded-md" placeholder="Role Name" ref={roleInput}/>
                <Checkbox.Group
                      style={{
                        width: '100%',
                      }}
                      onChange={onChangePermission}
                    >
                      <Row>
                        {allPermission?.map((temp, index) => {
                          let color = ""
                          let bgColor = ""
                          if(temp.name.includes("EDIT")){
                            color = "red"
                            bgColor = "bg-red-200"
                          }
                          else {
                            color = "green",
                            bgColor = "bg-green-200"
                          }
                          return  (
                            <Col span={8} key={index}>
                              <Tooltip className={`border-2 rounded-lg px-2 ${bgColor}`}  color={color} title={temp.label}>
                                <Checkbox value={temp.id}>{temp.name}</Checkbox>
                              </Tooltip>
                            </Col>
                          )
                        }
                         
                        )}
                      </Row>
                    </Checkbox.Group>
              </div> 
      </Modal>
    </>
  )
}
