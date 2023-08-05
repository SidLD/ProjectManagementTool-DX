/* eslint-disable react/prop-types */

import { Table } from "antd";

export const CustomeTable = ({users}) => {
    const data = users.map(member => ({
        key:member.id,
        name: `${member.user.firstName} ${member.user.lastName} `,
        role: member?.role?.name || "No Role"
    }))
    console.log(users)
    const columns = [
        {
          title: 'Project Member',
          dataIndex: 'name',
          key: 'name',
        },
        {
          title: 'Role',
          dataIndex: 'role',
          key: 'role',
        },
      ];
    return <div>
        <Table className='overflow-hidden hover:overflow-y-scroll' columns={columns} dataSource={data}
    pagination={false} 
    />
    </div>;
}
