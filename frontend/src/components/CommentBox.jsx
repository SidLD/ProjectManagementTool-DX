/* eslint-disable react/prop-types */
import { Avatar, Button } from "antd"
import TextArea from "antd/es/input/TextArea"
import { useContext, useEffect, useState } from "react"
import { createComment, getComment, replyComment } from "../lib/api"
import { RecursiveComment } from "./RecursiveComment"
import { FunctionContext, PageContext } from "../lib/context"

export const CommentBox = () => {
    const {task} = useContext(PageContext)
    const [comment, setComment] = useState("")
    const [comments, setComments] = useState([])
    const [loader, setLoader] = useState(true)
    const [show, setShow] =useState(false)
    const [selectComment, setSelectComment] = useState(null)
    const handleRemoveComment = () => {
        setSelectComment(null)
    }
    const handleSelectComment = (item) => {
        setSelectComment(item)
    }
    const handleChangeComment = (e) => {
        setComment(e.target.value)
    }
    const hanldeSubmitComment = async() => {
        try {
            if(selectComment !== null){
                const response = await replyComment(task.id ,{detail:comment, parentId:selectComment.id})
                // console.log(response)
                if(response.data.ok){
                    setComment("")
                    await fetchComments()
                }
            }else{
                const response = await createComment(task.id, {detail:comment})
                if(response.data.ok){
                    setComment("")
                    await fetchComments()
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
        } catch (error) {
            console.log(error)
        }
    }
    useEffect(() => {
        fetchComments()
        setLoader(false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[task])

    const values = {
        handleSelectComment,
    }
  return (
    <>
    {!loader && <>
    <Avatar className="shadow-xl" size={30} onClick={() => setShow(!show)}>
        M
    </Avatar>
    <div className={`${show ? 'block' : 'hidden'} rounded-lg shadow-2xl my-2 flex-col bg-slate-500 p-2`}>
        <FunctionContext.Provider value={values}>
            <div className="my-2">
                {comments.map((comment, index) => {
                    return  <div 
                        key={index}>
                        <RecursiveComment data={comment}/>
                    </div>
                })}
            </div>
        </FunctionContext.Provider>
        <div className="w-full">
        {selectComment !== null && <div className={`h-5 bg-slate-400 rounded-lg flex justify-between px-3 text-gray-500`}>
             replying to {selectComment.length > 20 ? selectComment.detail.substring(0,20) : selectComment.detail}
            <Button className="h-5 border-none" onClick={handleRemoveComment}>
            <svg className="h-4 w-4 hover:scale-120 text-gray-500"  width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">  <path stroke="none" d="M0 0h24v24H0z"/>  <line x1="18" y1="6" x2="6" y2="18" />  <line x1="6" y1="6" x2="18" y2="18" /></svg>
            </Button>
        </div>}
        <TextArea  className="" placeholder="Comment" value={comment}  onChange={handleChangeComment} autoSize />
            <Button className="float-right relative right-0 bottom-8 bg-blue-500 text-white" onClick={hanldeSubmitComment}>Send</Button>
        </div>
    </div>
        </>}
    </>
  )
}
