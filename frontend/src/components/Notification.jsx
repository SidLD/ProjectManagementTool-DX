/* eslint-disable react/prop-types */
import { Avatar, Badge, Button, Tooltip } from 'antd';
import { useEffect, useState } from 'react'
import { getMention, updateAllMention } from '../lib/api';
import { formatDate } from '../lib/helper';
import { useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';

//Need to add this before the component decleration
const socket = io(`${import.meta.env.VITE_API_URL}`,{
  transports: ["websocket"] });

export const Notification = () => {
    const [notifications, setNotifications] = useState([])
    const [openNotification, setOpenNotification] = useState(false)
    const navigate = useNavigate()

    const setRead = async (id) => {
      console.log("Update",id)
    }

    const handleReadAll = async () => {
      try {
        const response = await updateAllMention()
        console.log(response)
        if(response.data.ok){
          await fetchMention()
        }
      } catch (error) {
        console.log(error)
      }
    }

    const notificationRenderer = (data, index) => {
      const date = formatDate(data.comment.createdAt)
      return (
        <div key={index}
           onClick={async () => {
           await setRead(data.id)
           navigate(`/project/${data.comment.task.projectId}/tasks/${data.comment.task.id}`)
           }}
           className={`${data.isRead ? 'bg-gray-400' : 'bg-white'} cursor-pointer w-full mt-2 float-none rounded-md p-2 shadow-lg`}
         >
         <div className={` h-10 flex gap-2 justify-evenly items-center`}>
           <Tooltip title={data.comment.user.isActive ? "online" : "offline"}>
             <Badge className='flex' dot status={data.comment.user.isActive ? "success" : "default"}>
               <Avatar>{`${data.comment.user.firstName} ${data.comment.user.firstName}`}</Avatar>
             </Badge>
           </Tooltip>
           <p className='text-sm'>{`${data.comment.user.firstName} ${data.comment.user.lastName} mentioned you in a comment`}</p>
           <span className='flex gap-1 justify-evenly text-[10px] align-top'>
           <p>{`${date.min}m`}</p>
           <p>{`${date.hour}hr`}</p>
           <p>{`${date.day}`}</p>

           </span>         
         </div>
        </div>
      )
    };

    const fetchMention = async () => {
      try {
        const response = await getMention({})
        setNotifications(response.data.data)
      } catch (error) {
        console.log(error)
      }
    }

    const countUnreadMention = () => {
      return notifications.filter(temp => temp.isActive).length
    }

    useEffect(() => {
      fetchMention()
      socket.once('newMention', async() => {
        await fetchMention()
      })
      socket.once('newUser', async() => {
        await fetchMention()
      })
      socket.once('removeUser', async() => {
        await fetchMention()
      })
    },[])
    
  return (
        <>
              <Button className=' shadow-md border-none '
                  onClick={
                      () => setOpenNotification(!openNotification)
                  }>
                    <Badge className='dark:rounded-lg dark:p-2  dark:border-white dark:text-white px-2  text-start font-poppins text-blue-500' count={countUnreadMention()} size='small'>
                      @mentions
                    </Badge>
                </Button>
                {openNotification && (<div 
                    className="absolute top-16 z-40 p-2 shadow-lg w-96 h-72 overflow-auto rounded-lg mt-1 border-gray-400 bg-white">
                    
                      {notifications && notifications.length > 0 ? (
                        <div
                          className={`${
                            notifications.length <= 4 ? "mb-0" : "mb-6"
                          }`}
                        >
                            <div className='flex justify-end h-fit  w-full '>
                            <Button className='hover:scale-110 hover:shadow-lg border-none flex justify-center items-center' size="small" onClick={handleReadAll}>
                            <svg className="h-4 w-4 text-gray-500 mr-1"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  strokeWidth="2"  strokeLinecap="round"  strokeLinejoin="round">  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />  <path d="M13.73 21a2 2 0 0 1-3.46 0" /></svg>
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
