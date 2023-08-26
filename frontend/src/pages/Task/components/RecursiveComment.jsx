/* eslint-disable react/prop-types */

import {  useEffect, useState } from "react"
import { formatDate } from "../../../lib/helper"
import { Avatar } from "antd"
import { getReplyComment } from "../../../lib/api"
import { io } from "socket.io-client";
// import AppContext from "antd/es/app/context";

//Need to add this before the component decleration
const socket = io(`${import.meta.env.VITE_API_URL}`,{
  transports: ["websocket"] });

export const RecursiveComment = ({data, handleSelectComment, reply = false}) => {

  // const {fetchNotification} = useContext(AppContext)
  const [showDetail, setShowDetail] = useState(false)
  const date = formatDate(data.createdAt)
  const [childrenComment, setChildrenComment] = useState([])
  
  useEffect(() => {
    const fetchChilrenComment = async () => {
      try {
        const response = await getReplyComment(data.id, {})
        setChildrenComment(response.data.data)
        socket.emit('joinRoom', data.taskId)
      } catch (error) {
        console.log(error)
      }
    }
    fetchChilrenComment()

    const handleNewComment =  (res) => {
      console.log(res)
      fetchChilrenComment()
      // fetchNotification()s
    } 
    socket.on("newReply", handleNewComment)

    return () => socket.off('newReply', handleNewComment)
    
  },[])

  return (
    <>
      <div onMouseOver={() => setShowDetail(true)} onMouseOut={() => setShowDetail(false)} 
        className="my-2 w-full "
      >
        <div className="flex flex-row-reverse w-[70%]  justify-end items-center">
          {reply ? <>
            <svg className=" h-8 w-8 text-white"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  strokeWidth="2"  strokeLinecap="round"  strokeLinejoin="round">  <polyline points="9 10 4 15 9 20" />  <path d="M20 4v7a4 4 0 0 1-4 4H4" /></svg>
                <p className="w-[50%] bg-slate-200 mr-1 break-words rounded-lg p-2 ">{data.detail}</p>
                <Avatar> {data.user.firstName} {data.user.lastName}</Avatar>
              </>
            :
              <>
                <p className="w-full bg-slate-200 mr-1 break-words rounded-lg p-2 ">{data.detail}</p>
                <Avatar> {data.user.firstName} {data.user.lastName}</Avatar>
              </>
          }
          
        </div>
        {showDetail &&  <div 
            className=" text-xs text-slate-50 ml-10 flex justify-evenly items-center">
            <span>{data.user.firstName} {data.user.lastName}</span>
            <span>{`${date.month} ${date.year}`}</span>
            <span className="cursor-pointer hover:text-white delay-200" onClick={() => handleSelectComment(data)}>Reply</span>
        </div>}  
        {childrenComment.length > 0 && childrenComment.map((children) => (  
              <RecursiveComment 
                key={children.id}
                handleSelectComment={handleSelectComment} 
                data={children} 
                reply={true}
              />
        ))} 
      </div>
  </>
  )
}
