/* eslint-disable react/prop-types */

import {  useEffect, useState } from "react"
import { formatDate } from "../../../lib/helper"
import { Avatar } from "antd"
import { getReplyComment } from "../../../lib/api"

export const RecursiveComment = ({data, handleSelectComment, reply = false}) => {
  const [showDetail, setShowDetail] = useState(false)
  const date = formatDate(data.createdAt)
  const [childrenComment, setChildrenComment] = useState([])
  
  useEffect(() => {
    const fetchChilrenComment = async () => {
      try {
        const response = await getReplyComment(data.id, {})
        setChildrenComment(response.data.data)
      } catch (error) {
        console.log(error)
      }
    }
    fetchChilrenComment()
  },[data])

  return (
    <>
      <div onMouseOver={() => setShowDetail(true)} onMouseOut={() => setShowDetail(false)} 
        className="my-2 w-full"
      >
        <div className="flex justify-end items-center">
          {reply && <div>
          <div className="text-gray-300 font-bold h-full">
              <span className="">|</span>
                {/* <svg className="h-8 w-8 text-white"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  strokeWidth="2"  strokeLinecap="round"  strokeLinejoin="round">  <polyline points="15 10 20 15 15 20" />  <path d="M4 4v7a4 4 0 0 0 4 4h12" /></svg> */}
              </div>
          </div>}
          <p className="bg-slate-100 mr-1 break-words rounded-lg p-2 ">{data.detail}</p>
          <Avatar> {data.user.firstName} {data.user.lastName}</Avatar>
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
