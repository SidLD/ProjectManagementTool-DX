/* eslint-disable react/prop-types */

import { formatDate } from "../lib/helper"

export const Comment = ({data}) => {
    const date = formatDate(data.createdAt)
    console.log(data)
  return (
    <div className="flex justify-between">
        {data.detail}
        {date.month}
    </div>
  )
}
