import {useContext} from 'react'
import { PageContext } from "../../lib/context.js";
import {Button, Form, Input} from 'antd';
import {NavLink} from 'react-router-dom'
export const LoginView = () => {
  const {contextHolder, handleSubmitLogin} = useContext(PageContext)
  
  return (
    <>
    {contextHolder}
    <div className='h-screen sm:flex sm:justify-center sm:items-center sm:h-4/5'>
      <div className='rounded-xl'>
        <div className='p-10 '>
            <h1 className='text-center uppercase text-3xl shadow-lg rounded-lg'>Project Mangement Tool</h1>
          </div>
        <div className='rounded-xl sm:flex sm:justify-center sm:w-3/5 '>
          <Form 
              className="bg-blue-500 mx-4 p-4 rounded-xl shadow-lg "
              style={{
                borderRadius: "15px"
              }}
              labelAlign="right"
              initialValues={
                  {remember: true}
              }
              onFinish={handleSubmitLogin}
            >
            <Form.Item label="Email" name="email"
                rules={
                    [{
                      type:'email',
                      required: true,
                      message: "Please input your Student ID"
                    }]
                }
                style={
                    {width: "100%"}
            }>
                <Input/>
            </Form.Item>
            <Form.Item label="Password" name="password"
                rules={
                    [{
                      
                      required: true,
                      message: "Please input your password"
                    }]
                }
                style={
                    {width: "100%"}
            }>
                <Input.Password/>
            </Form.Item>
            <div className='flex-col justify-center'>
                <Button  htmlType="submit" className='w-full rounded-md  hover:text-white'>
                    Sign in
                </Button>
                <NavLink to={"/register"} className="flex justify-center p-2 rounded-md  hover:text-white ">
                    <p className='bold uppercase'>No Account? Register</p>
                </NavLink>
            </div>
          </Form>
        </div>
      </div>
    </div>
    </>
  )
}