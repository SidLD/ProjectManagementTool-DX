import { useContext } from 'react'
import { PageContext } from '../../../lib/context'
import { CustomeDate } from '../../../components/CustomeDate'
import { Progress,Tooltip } from 'antd'

export const ProjectDetail = () => {
    const {loader ,project} = useContext(PageContext)
    return ( 
        !loader && <div className='font-poppins bg-white rounded-2xl'>
            <h2>Title: {project.name}</h2>
            <p>Description: {project.description}</p>
            <p>Manager: {`${project?.manager?.firstName} ${project?.manager?.lastName}`}</p>
            <div className='my-5 flex w-full justify-between'>
                <CustomeDate borderColor="border-blue-800" title="Start Date" color="text-blue-500" date={project.startDate} />
                <CustomeDate borderColor="border-yellow-500" title="Due Date" color="text-yellow-500" date={project.endDate}/>
            </div>
            <Tooltip className='flex my-4 justify-center items-center' title={`${project.progress} %`} placement="right">
                <p className='text-left '>Progress</p>
                <Progress className='w-3/4 ml-2 my-auto' percent={project.progress}/>
            </Tooltip>
            {/* 
            {!loader &&  <Table columns={[
                {
                    title: 'Role',
                    dataIndex: 'name',
                    key: 'name',
                },
                {
                    title: 'Permissions',
                    dataIndex: 'permissions',
                    key: 'name',
                },
            ]}  
            dataSource={roles.map(role => ({
                key: role.id,
                name: role.name,
                permissions: (
                  <div className='grid-col-2'>
                    {[role?.role_permissions.map((permission) => {
                      let color = ""
                      if(permission.name.includes("EDIT")){
                        color = "red"
                      }
                      else {
                        color = "green"
                      }
                      return (
                        <Tooltip key={permission.id} color={color} title={permission.label}>
                            <Tag color={color} key={permission.id}>{permission.name}</Tag>
                        </Tooltip>
                      )
                    }
                    )]}
                  </div>
                ),
    
            }))}
                pagination={false}
            />}
            {/* {!loader &&  <RoleTable />} */}
        </div>
  )
}
