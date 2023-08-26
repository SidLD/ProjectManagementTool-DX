/* eslint-disable react/prop-types */
import { Avatar, Badge, Button, Modal, Tooltip } from 'antd';
import { useContext, useEffect, useState } from 'react'
import {  updateAllNotifications, updateNotifications, updateTeamStatus } from '../lib/api';
import { formatDate } from '../lib/helper';
import { useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import { auth } from '../lib/services';
import { AppContext } from '../lib/context';

//Need to add this before the component decleration
const socket = io(`${import.meta.env.VITE_API_URL}`,{
  transports: ["websocket"] });

export const Notification = () => {
    const {notification, fetchNotification, loader} = useContext(AppContext)
    const [openNotification, setOpenNotification] = useState(false)
    const [showInvitationModal, setShowInvitationModal] = useState(false)
    const [selectedNotifaction, setSelectedNotification] = useState({})
    const navigate = useNavigate()

    const handleSelectedNotificaion = async (data) => {
      if(data.type === 'MENTION'){
        await updateNotifications( data.id,{})
        navigate(`/project/${data.mention.comment.task.projectId}/tasks/${data.mention.comment.task.id}`)
        await fetchNotification()
      }else if(data.type === 'REPLY'){
        await updateNotifications( data.id,{})
        navigate(`/project/${data.comment.task.projectId}/tasks/${data.comment.task.id}`)
        await fetchNotification()
      }else{
        if(data.isRead){
          navigate(`/project/${data.team.projectId}`)
        }else{
          setShowInvitationModal(true)
          setSelectedNotification(data)
        }
      }
      
    }

    const handleAcceptInvitation = async () => {
      const result = await updateTeamStatus(
        selectedNotifaction.team.id,
        {})
      if(result){
        await updateNotifications( selectedNotifaction.id,{})
        navigate(`/project/${selectedNotifaction.team.projectId}`)
        setShowInvitationModal(false)
        await fetchNotification()
      }
    }

    const handleReadAll = async () => {
      try {
        const response = await updateAllNotifications()
        if(response.data.ok){
          await fetchNotification()
        }
      } catch (error) {
        console.log(error)
      }
    }

    const notificationRenderer = (data, index) => {
      const date = formatDate(data.createdAt)
      let content = ""

      if(data.type === "INVITATION"){
        content = "has Invited you to their project"
      }else if(data.type === "MENTION"){
        content = "has mentioned you in a comment"
      }else{
        content = "has replied to you"
      }

      return <div key={index}
            onClick={() => {handleSelectedNotificaion(data)}}
            className={`${data.isRead ? 'bg-gray-400' : 'bg-white'} cursor-pointer w-full mt-2 float-none rounded-md p-2 shadow-lg`}
            >
              <div className={` h-10 flex gap-2 justify-evenly items-center`}>
                <Tooltip title={data.user.isActive ? "online" : "offline"}>
                  <Badge className='flex' dot status={data.user.isActive ? "success" : "default"}>
                    <Avatar>{`${data.user.firstName} ${data.user.lastName}`}</Avatar>
                  </Badge>
                </Tooltip>
                <p className='text-sm'>{`${data.user.firstName} ${data.user.lastName} ${content}`}</p>
                <span className='flex gap-1 justify-evenly text-[10px] align-top'>
                <p>{`${date.min}m`}</p>
                <p>{`${date.hour}hr`}</p>
                <p>{`${date.day}`}</p>

                </span>         
              </div>
            </div>
    };

    const countUnreadNotification = () => {
      return notification?.filter(item => !item.isRead).length
    }

    useEffect(() => {
      fetchNotification()

      const handleNewMention = async(data) => {
          if(data.includes(auth.getUserInfo().id)){
            await fetchNotification()
          }
      }

      const handleNewInvitation = async () => {
        await fetchNotification()
      }

      socket.on('newMention', handleNewMention)
      socket.on('newMember', handleNewInvitation)
    },[])
    
  return (
    !loader && <>
              <Button className='dark:shadow-blue-500 dark:shadow-sm   shadow-md border-none '
                  onClick={
                      () => setOpenNotification(!openNotification)
                  }>
                    <Badge 
                      className='dark:rounded-lg dark:p-2  dark:border-white dark:text-white px-2  text-start font-poppins text-blue-500' 
                      count={countUnreadNotification()} size='small'>
                      @mentions
                    </Badge>
                </Button>
                {openNotification && (<div 
                    className="dark:bg-slate-950 absolute top-16 z-40 p-2 shadow-2xl w-96 h-72 overflow-y-scroll rounded-lg mt-1 border-gray-400 bg-white">
                    
                      {notification && notification.length > 0 ? (
                        <div
                          className={`${
                            notification.length <= 4 ? "mb-0" : "mb-6"
                          }`}
                        >
                            <div className='flex justify-end h-fit  w-full '>
                            <Button className='dark:text-white  hover:scale-110 hover:shadow-lg border-none flex justify-center items-center' size="small" onClick={handleReadAll}>
                            <svg className="dark:text-white h-4 w-4 text-gray-500 mr-1"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  strokeWidth="2"  strokeLinecap="round"  strokeLinejoin="round">  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />  <path d="M13.73 21a2 2 0 0 1-3.46 0" /></svg>
                                Read All
                            </Button>
                            </div>
                          {notification.map((item, idx) => {
                            return notificationRenderer(item, idx);
                          })}
                        </div>
                      ) : (
                        <div className="flex flex-row items-center justify-center h-full w-full">
                          <p className="text-base italic text-gray-400">
                            You have no notifications
                          </p>
                        </div>
                      )}
                    </div>)
            }
            <Modal onOk={handleAcceptInvitation} open={showInvitationModal} onCancel={() => setShowInvitationModal(false)}>
                <p>Accept Invitation?</p>
            </Modal>
        </>
    )
}
