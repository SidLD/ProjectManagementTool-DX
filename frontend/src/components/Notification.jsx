/* eslint-disable react/prop-types */
import { Avatar, Badge, Button, Tooltip } from 'antd';
import { useEffect, useState } from 'react'
import { getMention } from '../lib/api';
import { formatDate } from '../lib/helper';
import { useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import OutsideClickHandler from 'react-outside-click-handler';

//Need to add this before the component decleration
const socket = io(`${import.meta.env.VITE_API_URL}`,{
  transports: ["websocket"] });
export const Notification = () => {
    const [notifications, setNotifications] = useState([])
    const [openNotification, setOpenNotification] = useState(false)
    const navigate = useNavigate()

    const setRead = (id) => {
      console.log("Update",id)
    }
    const handleReadAll = () => {

    }
    const notificationRenderer = (data, index) => {
      const cutMessage = data.comment.detail.substring(0,100)
      const date = formatDate(data.comment.createdAt)
        return (
             <div key={index}
                className="w-full mt-2 float-none rounded-md p-2 shadow-lg bg-slate-200"
              >
              <div className='h-10 flex justify-evenly items-center'>
                <Tooltip title={data.comment.user.isActive ? "online" : "offline"}>
                  <Badge className='flex' dot status={data.comment.user.isActive ? "success" : "default"}>
                    <Avatar>{`${data.comment.user.firstName} ${data.comment.user.firstName}`}</Avatar>
                  </Badge>
                </Tooltip>
                <p className='text-sm'>{`${data.comment.user.firstName} ${data.comment.user.lastName} mentioned you in a comment`}</p>
                <p className='flex justify-center items-center text-[10px]'>{`${date.min}m ${date.hour}hr ${date.day}`}</p>
              </div>
              <p 
                onClick={() => {
                  setRead(data.id)
                  navigate(`/project/${data.comment.task.projectId}/tasks/${data.comment.task.id}`)
                }}
                className='ml-10 break-words text-sm cursor-pointer'>{cutMessage}</p>
                <div className='flex justify-end w-full'>
                  <Button className='relative bottom-3 text-sm border-none' onClick={() => setRead(data.id)}>Set Read</Button>
                </div>
             </div>
        )
    };
    useEffect(() => {
      const fetchMention = async () => {
        try {
          const response = await getMention({})
          setNotifications(response.data.data)
        } catch (error) {
          console.log(error)
        }
      }
      fetchMention()
      socket.on('newMention', async() => {
        await fetchMention()
      })
      socket.on('newUser', async() => {
        await fetchMention()
      })
      socket.on('removeUser', async() => {
        await fetchMention()
      })
    },[socket])
  return (
        <>
            <OutsideClickHandler onOutsideClick={() => setOpenNotification(false)}>
              <Button className='shadow-md border-none '
                      onClick={
                          () => setOpenNotification(!openNotification)
                      }>
                        <Badge className='px-2  text-start font-poppins text-blue-500' count={notifications.length} size='small'>
                          @mentions
                        </Badge>
                </Button>
            </OutsideClickHandler>
                {openNotification && (<div 
                    className="absolute top-16 z-40 p-2 shadow-lg w-96 h-72 overflow-auto rounded-lg mt-1 border-gray-400 bg-white">
                    
                      {notifications && notifications.length > 0 ? (
                        <div
                          className={`${
                            notifications.length <= 4 ? "mb-0" : "mb-6"
                          }`}
                        >
                            <div className='flex justify-end h-fit  w-full '>
                            <Button className='border-none' size="small" onClick={handleReadAll}>
                                Read All
                            </Button>
                            </div>
                          {notifications.map((item, idx) => {
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
        </>
    )
}
