import { Button, Tooltip } from "antd";
import { formatDate } from "../../../lib/helper";
import { useState } from "react";
import { useContext } from "react";
import { PageContext } from "../../../lib/context";
import { Modal } from "antd";

export const Logs = () => {
    const {logs} = useContext(PageContext)
    const [showLogs, setShowLogs] = useState(false) 

  return (
    <>
    <Button className="hover:scale-110 hover:shadow-md flex justify-center items-center border-none text-white " 
      onClick={() => setShowLogs(!showLogs)}>
        <Tooltip title='LOGS' color="yellow">
          <svg className="h-8 w-8 text-blue-500"  fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
          </svg>
        </Tooltip>
    </Button>  
    
    <Modal open={showLogs} onCancel={() => setShowLogs(false)} footer={null}>
    <div className={`overflow-y-scroll h-full`}>
      {logs?.map((log, index) => {
        const date = formatDate(log.createdAt);
        return <div key={index} className="flex justify-between items-center my-2">
            <p className="text-gray-500">{`${log.detail} by ${log.user.firstName}, ${log.user.lastName}`} </p>
            <p className="text-xs">{`${date.min}m ${date.hour}hr ${date.day} ${date.month}`}</p>
          </div>
      })}
    </div>
    </Modal>
  </>
  )
}
