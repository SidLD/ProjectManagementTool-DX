import {useContext} from 'react'
import { PageContext } from "../../lib/context.js";
import {Button, Form, Input} from 'antd';
import { Tooltip } from 'antd';
export const LoginView = () => {
  const {contextHolder, handleSubmitLogin, navigate} = useContext(PageContext)
  
  return (
    <>
    {contextHolder}
    <div className='h-screen lg:flex lg:justify-center lg:items-center'>
    <div className='p-5 h-full lg:flex lg:justify-center lg:items-center lg:rounded-3xl lg:shadow-2xl lg:h-4/5 lg:w-4/5 lg:p-0'>
        <div className='h-1/6 flex justify-center rounded-l-2xl items-center lg:w-1/2 lg:h-full lg:bg-blue-400'>
            <h1 className='rounded-lg text-center uppercase  text-3xl font-poppins'>
              Hello! This is <br />
              Project Mangement Tool
            </h1>
          </div>
        <div className='h-5/6 flex justify-center items-center lg:w-1/2'>
          <Form 
              className="p-4 w-full md:w-3/4 lg:w-full rounded-xl"
              style={{
                borderRadius: "15px"
              }}  
              labelAlign="right"
              initialValues={
                  {remember: true}
              }
              onFinish={handleSubmitLogin}
            >
            <Tooltip title="Email" className='p-2'>
              <Form.Item name="email"
                  rules={
                      [{
                      
                        required: true,
                        message: "Please input your Email"
                      }]
                  }
                  style={
                      {width: "100%"}
              }>
                <Input placeholder='Email' className='h-10 border-2 rounded-full shadow-lg'/>
            </Form.Item>
            </Tooltip>
            <Tooltip title="Password" className='p-2'>
              <Form.Item name="password"
                  rules={
                      [{
                      
                        required: true,
                        message: "Please input your password"
                      }]
                  }
                  style={
                      {width: "100%"}
              }>
                <Input.Password placeholder='Password' className='h-10 border-2 rounded-full shadow-lg'/>
            </Form.Item>
            </Tooltip>
                
            <div className='flex-col justify-between items-center'>
                <Button  htmlType="submit" className='mb-6 w-full h-12 rounded-full bg-blue-500 text-white shadow-lg'>
                    Sign in
                </Button>
                <Button onClick={() => navigate("/register")} className="w-full h-12 rounded-full shadow-lg">
                    <p className='bold uppercase'>No Account? Register</p>
                </Button>
            </div>
          </Form>
        </div>
      </div>
    </div>
    </>
  )
}