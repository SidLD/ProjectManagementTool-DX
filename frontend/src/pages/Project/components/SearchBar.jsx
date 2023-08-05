import { Button, Modal, Select} from "antd";
import {getUsers} from '../../../lib/api'
import { useContext, useEffect, useState } from "react";
import { PageContext } from "../../../lib/context";
export const SearchBar = () => {
    const {roles, showMessage, addTeamMember} = useContext(PageContext)
    const [data, setData] = useState([{}]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState()
    const [items, setItems] = useState([])
    const [selectedRole, setSelectedRole] = useState()
    const handleRoleChange = (e) => {
        setSelectedRole(e)
    }
    const showModal = () => {
        if(selectedUser && selectedRole){
            setIsModalOpen(true);
        }else{
            showMessage('warning', 'No Input Data')
        }
    };
    const handleOk = async () => {
        await addTeamMember({
            userId: selectedUser,
            roleId: selectedRole
        })
        setIsModalOpen(false);
        setSelectedUser(null)
    };
    const handleCancel = () => {
        setIsModalOpen(false);
    };
    const handleSelect = (value) => {
        setSelectedUser(value)
    };
    const onSearch = async (query) => {
        try {
            const payload = {
                email:query, 
                firstName:query, 
                lastName: query
            }
            setTimeout(async () =>{
               const response =  await getUsers(payload)
               setData(response.data.data)
            },1000)
        } catch (error) {
            setData([])
            // console.log(error)
        }
    }
    useEffect(() => {
        setItems(roles?.map((role) => ({value: role.id, label: role.name})))
    },[roles])
    return (
        <>
        <div className="w-full">
            <Select
                showSearch
                style={{ width: 400 }}
                onSearch={onSearch}
                onSelect={handleSelect}
                placeholder="Input Email or Name"
                optionFilterProp="children"
                filterOption={(input, option) =>
                    (option?.label ?? '').toLowerCase().includes(input.toLowerCase() || "")
                }
                options={data.map(item => (
                    {
                        value: item.id,
                        label: `${item.email} ${item.firstName} ${item.lastName}`
                    }
                ))}
            />
            <Select 
                style={{ width: 150 }}
                options={items}
                onChange={handleRoleChange}
                placeholder="Select Role"
            />
            <Button className="float-right" onClick={showModal}>
                Add User
            </Button>
        </div>
        <Modal title="Set Role" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
            <p>Confirm Add User?</p>
        </Modal>
        </>
    )
}
