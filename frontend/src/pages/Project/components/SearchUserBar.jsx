import { Button, Modal, Select} from "antd";
import {createTeamMember, getRoles, getUsers} from '../../../lib/api'
import { useContext, useEffect, useState } from "react";
import { PageContext } from "../../../lib/context";

import { io } from 'socket.io-client'

const socket = io(`${import.meta.env.VITE_API_URL}`,{
  transports: ["websocket"] });


export const SearchBar = () => {
    const {showMessage, projectId, fetchTeam} = useContext(PageContext)
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
        try {
            const payload = [{
                userId: selectedUser,
                roleId: selectedRole
            }]
            const response = await createTeamMember(projectId, payload)
            if(response.data.ok){
                
                showMessage('success',"Success")
                await fetchTeam()             
                setIsModalOpen(false);
                setSelectedUser({})
                setSelectedRole([])
                socket.emit('createMember', response.data.data)
            }else{
              showMessage('warning',"Something Went Wrong")
            }
          } catch (error) {
            showMessage('warning',error.response.data.message)
          }
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
                OR: [
                    {email: query},
                    {firstName: query},
                    {lastName: query}
                ],
                
                limit: 5
            }
            setTimeout(async () =>{
               const response =  await getUsers(payload)
               setData(response.data.data)
               
            },500)
        } catch (error) {
            setData([])
            // console.log(error)
        }
    }
    useEffect(() => {
        const fetchRoles = async () => {
            try {
              const payload = {
                projectId,
                start: 0,
                limit: 99,
                order: {
                    name: 'asc'
                }
              }
              const response = await getRoles(payload)   
              setItems(response.data.data?.map((role) => ({value: role.id, label: role.name})))
            } catch (error) {
              console.log(error)
            }
          }
        fetchRoles()
    },[])
    return (
        <>
        <div className="w-full flex">
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
            <Button className="bg-yellow-300 font-bold  float-right" onClick={showModal}>
                Add User
            </Button>
        </div>
        <Modal title="Set Role" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
            <p>Confirm Add User?</p>
        </Modal>
        </>
    )
}
