/* eslint-disable react/prop-types */
import { Button } from "antd"
import TextArea from "antd/es/input/TextArea"
import { useEffect, useState } from "react"
import { createComment, getComment } from "../lib/api"
import { formatDate } from "../lib/helper"

export const CommentBox = ({data}) => {
    // console.log(data)
    const [comment, setComment] = useState("")
    const [comments, setComments] = useState([])
    const [loader, setLoader] = useState(true)
    const [show, setShow] =useState(false)
    const handleChangeComment = (e) => {
        setComment(e.target.value)
    }
    const hanldeSubmitComment = async() => {
        try {
            const response = await createComment(data.id, {detail:comment})
            if(response.data.ok){
                setComment("")
                await fetchComments()
            }
        } catch (error) {
            console.log(error)
        }
    }
    const fetchComments = async () => {
        try {
            const response = await getComment(data.id, {})
            setComments(response.data.data)
        } catch (error) {
            console.log(error)
        }
    }
    useEffect(() => {
        fetchComments()
        setLoader(false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[])
  return (
    <>
    {!loader && <>
    <Button onClick={() => setShow(!show)}>C</Button>
     <div className={show ? 'block' : 'hidden'}>
        <div className="bg-slate-500">
            {comments.map((comment, index) => {
                const date = formatDate(comment.createdAt)
                return  <div 
                    className="flex"
                    key={index}>
                        {comment.detail} - {date.hour}
                </div>
            })}
        </div>
        <div>
        <TextArea placeholder="Comment" value={comment}  onChange={handleChangeComment} autoSize />
            <Button onClick={hanldeSubmitComment}>Send</Button>
        </div>
    </div>
        </>}
    </>
  )
}
