/* eslint-disable react/prop-types */
import { Button, Checkbox, Col, Modal, Row, Table, Tag } from 'antd';
import { useContext, useState } from 'react';
import { PageContext } from '../../../lib/context';
const { Column } = Table;

export const UserTable = ({data = []}) => {
    const {roles} = useContext(PageContext)
    const [showModal, setShowModal] = useState(false)
    const [selectedData, setSelectedData] = useState(null)
    // console.log(roles)
    const onChangePermission = (e) => {
      console.log(e)
    }
    const handleShowModal = (id, type) => {
      setShowModal(true)
      const functionType = type.toLowerCase() === "edit" ? saveEditRole : saveRemoveRole
      const detail = type.toLowerCase() === "edit" ? 
        (<h2 className='text-red-500'>Confirm to delete Role</h2>) : 
        (<h2 className=''>
          <Checkbox.Group
                      style={{
                        width: '100%',
                      }}
                      onChange={onChangePermission}
                    >
                      <Row>
                        {roles.permissions?.map((temp, index) =>
                          (
                            <Col span={8} key={index}>
                              <Checkbox value={temp}>{temp.name}</Checkbox>
                            </Col>
                          )
                        )}
                      </Row>
                    </Checkbox.Group>
        </h2>)
      setSelectedData(
        (
          <div>
            {detail}
            <Button onClick={() => functionType(id)}>{type}</Button>
          </div>
        )
      )
    }
    const handleCancel = () => {
      setShowModal(false)
    }
    const saveRemoveRole = (id) => {
      console.log("Remove", id)
      setShowModal(false)
    }
    const saveEditRole = (id) => {
      console.log("EDIT",id)
      setShowModal(false)
    }
    const items = data.map((data) => (
        {
            key: data.id,
            name: `${data.user.firstName} ${data.user.lastName}`,
            role: (<Tag>{data?.role?.name }</Tag>),
            action: <>
            <Button onClick={() => handleShowModal(data.id, "Remove")}>Remove</Button>
            <Button onClick={() => handleShowModal(data.id, "Edit")}>Edit</Button>
            </>

        }
    ))
  return (
    <>
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
      {selectedData}
    </Modal>
    </>
  )
}
