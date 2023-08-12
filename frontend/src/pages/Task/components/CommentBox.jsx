/* eslint-disable react/prop-types */
import { Button } from "antd"
import { useContext, useEffect, useState } from "react"
import { createComment, getComment, replyComment } from "../../../lib/api"
import { RecursiveComment } from "./RecursiveComment"
import { PageContext } from "../../../lib/context"
import io from "socket.io-client";
import { Mentions } from "./Mentions"
//Need to add this before the component decleration
const socket = io(`${import.meta.env.VITE_API_URL}`,{
         transports: ["websocket"] });
export const CommentBox = () => {
    const {task} = useContext(PageContext)
    const [comments, setComments] = useState([])
    const [loader, setLoader] = useState(true)
    const [selectComment, setSelectComment] = useState(null)
    const handleRemoveComment = () => {
        setSelectComment(null)
    }
    const handleSelectComment = (item) => {
        setSelectComment(item)
    }
    const hanldeSubmitComment = async(message, savedMentions) => {
        try {
            if(selectComment !== null){
                const payload = {
                    detail:message, 
                    parentId:selectComment.id,
                    mentions: savedMentions
                }
                const response = await replyComment(task.id ,payload)
                if(response.data.ok){
                    socket.emit('createComment', "From Client")
                    if(savedMentions.length > 0) {
                        socket.emit('createMention', "From Client")
                    }
                    await fetchComments()
                    return true
                }else{
                    return false
                }
            }else{
                const payload = {
                    detail: message,
                    mentions: savedMentions
                }
                const response = await createComment(task.id, payload)
                if(response.data.ok){
                    try {
                        socket.emit('createComment', "From Client")
                        if(savedMentions.length > 0) {
                            socket.emit('createMention', "From Client")
                        }
                    } catch (error) {
                        console.log(error)
                    }
                    await fetchComments()
                    return true
                }else{
                    return false
                }
            }
            
        } catch (error) {
            console.log(error)
        }
    }
    const fetchComments = async () => {
        try {
            const response = await getComment(task.id, {})
            setComments(response.data.data)
            console.log(response.data.data)
        } catch (error) {
            console.log(error)
        }
    }
    useEffect(() => {
        fetchComments()
        socket.on("newComment", async() => {
            await fetchComments()
        })
        setLoader(false)
        socket.on('newUser', async () => {
            await fetchComments()
           })
        socket.on('removeUser', async () => {
            await fetchComments()
           })
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[task, socket])
  return (
    <>
    {!loader && <>
    <div className={` rounded-lg shadow-2xl my-2 bg-slate-500 p-2`}>
            <div className="w-full">
                {comments.map((comment, index) => {
                    return <RecursiveComment handleSelectComment={handleSelectComment} key={index} data={comment}/>
                })}
            </div>
        <div className="w-full">
        {selectComment !== null && <div className={`h-5 bg-slate-400 rounded-lg flex justify-between px-3 text-gray-500`}>
             replying to {selectComment.length > 20 ? selectComment.detail.substring(0,20) : selectComment.detail}
            <Button className="h-5 border-none" onClick={handleRemoveComment}>
            <svg className="h-4 w-4 hover:scale-120 text-gray-500"  width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">  <path stroke="none" d="M0 0h24v24H0z"/>  <line x1="18" y1="6" x2="6" y2="18" />  <line x1="6" y1="6" x2="18" y2="18" /></svg>
            </Button>
        </div>}
        <Mentions hanldeSubmitComment={hanldeSubmitComment}  task={task}/>
        </div>
    </div>
        </>}
    </>
  )
}