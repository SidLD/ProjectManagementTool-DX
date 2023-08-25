import { useContext, useState } from 'react'
import { PageContext } from '../../../lib/context'
import { CustomeDate } from '../../../components/CustomeDate'
import { Button, Form, Input, Modal, Progress,Tooltip , DatePicker} from 'antd'
import TextArea from 'antd/es/input/TextArea'
import dayjs from "dayjs";

export const ProjectDetail = () => {
    const {loader ,project, userPermission, handleSubmitEditProject} = useContext(PageContext)
    const [show, setShow] = useState(false)
    const { RangePicker } = DatePicker;

    const handleFinishEdit = async (e) => {
        if(await handleSubmitEditProject(e)){
            setShow(false)
        }
    }

    return ( 
    <>{
        !loader && <div className=' font-poppins rounded-2xl'>

        {userPermission.includes('EDIT-PROJECT') && <Button className='float-right border-none hover:scale-125' 
            onClick={() => setShow(true)}>
            <Tooltip title="Edit Project Detail">
                <svg className="h-5 w-5 text-red-500" width="24"  height="24"  viewBox="0 0 24 24"  xmlns="http://www.w3.org/2000/svg"  fill="none"  stroke="currentColor"  strokeWidth="2"  strokeLinecap="round"  strokeLinejoin="round">  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
            </Tooltip>
        </Button>}

        <h2>Title: {project.name}</h2>
        <p>Description: {project.description}</p>
        <p>Manager: <span  className='uppercase'>{`${project?.manager?.firstName} ${project?.manager?.lastName}`}</span></p>
        <div className='my-5 flex w-full justify-between'>
            <CustomeDate borderColor="border-blue-800" title="Start Date" color="text-blue-500" date={project.startDate} />
            <CustomeDate borderColor="border-yellow-500" title="Due Date" color="text-yellow-500" date={project.endDate}/>
        </div>
        <Tooltip className=' flex my-4 justify-center items-center' title={`${project.progress} %`} placement="right">
            <p className='text-left '>Progress</p>
            <Progress className='dark:rounded-lg dark:border-2 dark:border-blue-500 w-3/4 ml-2 my-auto' percent={project.progress}/>
        </Tooltip>
        </div>
    }
    <Modal title="Edit Project Detail" open={show} onCancel={() => setShow(false)} footer={null}>
    <Form
        labelCol={{
            span: 5,
        }}
        wrapperCol={{
            span: 16,
        }}
        initialValues={
            {
                'name': project.name,
                'description':project.description,
                'startEndTime':[dayjs(project.startDate) , dayjs( project.endDate)]
            }
        }
        layout="horizontal"
        onFinish={handleFinishEdit}
        >
        <Form.Item label="Title" name="name"
            rules={[
            {
                required: true,
            },
            ]}
        > 
            <Input />
        </Form.Item>
        <Form.Item label="Description" name="description"
            rules={[
            {
                required: true,
            },
            ]}
        > 
            <TextArea rows={4} />
        </Form.Item>
        <Form.Item
            name="startEndTime"
            label={"Date"}
            rules={[{ required: true, message: "Please add Start and End Date" }]}
        >
        <RangePicker
            showTime={{
            hideDisabledOptions: true,
            }}
            format="YYYY-MM-DD hh:mm a"
            style={{ width: "100%" }}
        />
        </Form.Item>
        <Button className="w-full bg-blue-500 hover:text-slate-50" htmlType="submit">Save Project</Button>
        </Form>
    </Modal>
    </>
  )
}
