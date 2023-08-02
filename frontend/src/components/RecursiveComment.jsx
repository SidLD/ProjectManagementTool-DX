/* eslint-disable react/prop-types */

import { useContext, useState } from "react"
import { formatDate } from "../lib/helper"
import { FunctionContext } from "../lib/context"

export const RecursiveComment = ({data}) => {
  const {handleSelectComment} = useContext(FunctionContext)
  const [showDetail, setShowDetail] = useState(false)
  const date = formatDate(data.createdAt)
  const childrenComment = data.childrenComment || []
  return (
    <>
    <div 
      onMouseOver={() => setShowDetail(true)} 
      onMouseOut={() => setShowDetail(false)} 
      className="w-2/3 my-2">
        <p  className="flex-1  rounded-lg p-2 bg-slate-100 h-10">{data.detail}</p>
        {showDetail &&  <>
          <span className="mx-2 bg-transparent text-xs">{data.user.firstName} {data.user.lastName}</span>
          <span className="mx-2 bg-transparent text-xs">{`${date.month} ${date.year}`}</span>
          <span className="mx-2 bg-transparent text-xs cursor-pointer hover:text-white delay-200" onClick={() => handleSelectComment(data)}>Reply This</span>
          </>}
    </div>
    {childrenComment.length > 0 && childrenComment.map((children) => (  
          <div className="ml-2" key={children.id}>
            <RecursiveComment key={children.id} data={children} />
            </div>
        ))}
  </>
  )
}
