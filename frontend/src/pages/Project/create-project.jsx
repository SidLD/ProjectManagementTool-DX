import { Form, Input , Button, Modal, DatePicker, Row, Col, Checkbox, message} from "antd"
import { useEffect, useRef, useState } from "react";
import { createProject, getAllPermission } from "../../lib/api";
import { RoleTable } from './components/RoleTable';
import TextArea from "antd/es/input/TextArea";
import { useNavigate } from "react-router-dom";

export const CreateProject = () => {
  const [open, setOpen] = useState(false);
  const { RangePicker } = DatePicker;
  const navigate = useNavigate()
  const [permissions, setPemissions] = useState()
  const [roles, setRoles] = useState([])
  const [selectedPermission, setSelectedPermission] = useState([])
  const roleInput = useRef()
  const [messageAPI, contextHolder] = message.useMessage()


  const handleRemoveRole = (id) => {
    setRoles(roles.filter(role => role.id !== id))
  }
  const showMessage = (type, content) => {
    messageAPI.open({
      type,
      content
    })
  }
  const showModal = () => {
    setOpen(true);
  };
  const handleOk = () => {
    if(roleInput.current.value.trim() === "" || selectedPermission.length < 1){
      showMessage('warning', 'Please Input Data')
    }else{
      const data = {
        id: roles.length + 2,
        name : roleInput.current.value,
        role_permissions: selectedPermission
      }
      setRoles([...roles, data])
      console.log('roles', data)
      roleInput.current.value = ""
      setOpen(false);
      showMessage('success', 'Ok')
    }
  };
  const onChangePermission = (e) => {
    setSelectedPermission(e)
  }
  const handleCancel = () => {
    setOpen(false)
  }
  const handleSubmit = async (e) => {
    if(roles.length > 0){
      const payload = {
        name: e.name,
        descripion: e.descripion,
        startDate: e.startEndTime[0],
        endDate: e.startEndTime[1],
        roles
      }
      try {
        const result = await createProject(payload)
        if(result.data.ok){
          showMessage('success', 'Success')
          setTimeout(() => {
            navigate(`/project/${result.data.data.project.id}`)
          }, 1000)
        }
      } catch (error) {
        showMessage('warning', error.response.data.message)
      }
    }else{
      showMessage('warning', 'Please Input atleast one Role')
    }
    
  }
  useEffect(() => {
    const getPermissions = async () => {
      try {
        const response = await getAllPermission()
        setPemissions(response.data.data)
      } catch (error) {
        console.log(error)
      }
    }
    getPermissions()
  }, [])
  return (
    <div className="flex justify-between p-2">
      <div className="w-1/2">
        <Form
          labelCol={{
            span: 4,
          }}
          wrapperCol={{
            span: 14,
          }}
          layout="horizontal"
          onFinish={handleSubmit}
        >
          <Form.Item label="Title" name="name"
             rules={[
              {
                required: true,
              },
            ]}
          > 
            <Input />
          </Form.Item>
          <Form.Item label="Description" name="descripion"
             rules={[
              {
                required: true,
              },
            ]}
          > 
            <TextArea rows={4} />
          </Form.Item>
          <Form.Item
            name="startEndTime"
            label={"Date"}
            rules={[{ required: true, message: "Please add Start and End Date" }]}
          >
          <RangePicker
            showTime={{
              hideDisabledOptions: true,
            }}
            format="YYYY-MM-DD hh:mm a"
            style={{ width: "100%" }}
          />
          </Form.Item>
          <Button className="w-5/6 bg-blue-500 hover:text-slate-50" htmlType="submit">Create Project</Button>
        </Form>
      </div>
      <div className="w-1/2">
        <Button className="float-right mb-2 border-2 border-blue-500" onClick={showModal}>
          Create Role
        </Button>
        <div>
          <RoleTable data={roles} handleRemoveRole={handleRemoveRole}/>
        </div>
      </div>
          {contextHolder}
          <Modal
              title="Create Role"
              open={open}
              onOk={handleOk}
              onCancel={handleCancel}
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
                        {permissions?.map((temp, index) =>
                          (
                            <Col span={8} key={index}>
                              <Checkbox value={temp}>{temp.name}</Checkbox>
                            </Col>
                          )
                        )}
                      </Row>
                    </Checkbox.Group>
              </div> 
          </Modal>
    </div>
  )
}
