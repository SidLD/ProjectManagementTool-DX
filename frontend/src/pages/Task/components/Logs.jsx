import { Button } from "antd";
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
    <Button className="bg-blue-500 text-white " 
    onClick={() => setShowLogs(!showLogs)}>Logs</Button>  
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
