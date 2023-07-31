/* eslint-disable react/prop-types */
import { Button, Table, Tag } from 'antd';
const { Column } = Table;

export const UserTable = ({data = [], handleRemoveRole, handleEditRole}) => {
    const saveEditRole = () => {
      handleEditRole()
    }
    const items = data.map((data) => (
        {
            key: data.id,
            name: `${data.user.firstName} ${data.user.lastName}`,
            role: (<Tag>{data.role.name }</Tag>),
            action: <>
            <Button onClick={() => handleRemoveRole(data.id)}>Remove</Button>
            <Button onClick={saveEditRole}>Edit</Button>
            </>

        }
    ))
  return (
    <Table dataSource={items}>
    <Column title="User" dataIndex="name" key="name" />
    <Column
      title="Role"
      dataIndex="role"
      key="role"
    />
    <Column title="Action" dataIndex="action" key="action" />
  </Table>
  )
}
