/* eslint-disable react/prop-types */
import { Button, Table, Tag } from 'antd';
const { Column } = Table;

export const RoleTable = ({data = [], handleRemoveRole, handleEditRole}) => {
    const saveEditRole = () => {
      handleEditRole()
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
            <Button onClick={() => handleRemoveRole(data.id)}>Remove</Button>
            <Button onClick={saveEditRole}>Edit</Button>
            </>

        }
    ))
  return (
    <Table dataSource={items}>
    <Column title="Role" dataIndex="name" key="name" />
    <Column
      title="Permissions"
      dataIndex="permissions"
      key="permissions"
    />
    <Column title="Action" dataIndex="action" key="action" />
  </Table>
  )
}
