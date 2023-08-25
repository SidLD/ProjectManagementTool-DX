import { useContext, useState } from "react"
import { PageContext } from "../../lib/context"
import {Button, Form, Input, Select} from 'antd';
import { Tooltip } from 'antd';
// import blueBack from '../../assets/blueBack.jpg'

export const LoginRegisterView = () => {
  const [showLogin, setShowLogin] = useState(true)
  const {contextHolder, handleSubmitLogin, handleSubmitRegister} = useContext(PageContext)

  return (
    <>
     {contextHolder}
     <div className="w-screem h-screen flex justify-center items-center">
      <div className={`${showLogin ? 'block' : 'hidden'} lg:w-[70%] sm:shadow-lg sm:rounded-lg sm:h-[80%] sm:w-[80%] sm:flex-row h-full w-full justify-center items-center flex flex-col-reverse`}>
        <div className='lg:w-[50%] sm:rounded-l-lg   sm:h-full h-[80%] w-[80%] flex justify-center items-center'>
          <Form 
              className="p-5 w-full"
              labelAlign="right"
              initialValues={
                  {remember: true}
              }
              onFinish={handleSubmitLogin}
            >
            <Tooltip title="Email" className='p-2'>
              <Form.Item 
                  name="email"
                  rules={
                      [{
                        required: true,
                        message: "Please input your Email"
                      }]
                  }
                  style={
                      {width: "100%"}
              }>
                <Input placeholder='Email' 
                  className='text-[15px]  border-1 border-gray-500 rounded-full px-5 p-3'/>
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
                 >
                <Input.Password placeholder='Password' 
                  className='text-[15px] border-1 border-gray-500 rounded-full px-5 p-3'/>
            </Form.Item>
            </Tooltip>
                
            <div className='flex flex-col gap-4 '>
                <Button  htmlType="submit" 
                  className='text-md flex justify-center items-center h-[40px] rounded-full px-5 p-3 bg-blue-400 w-full'>
                    Sign in
                </Button>
            </div>
          </Form>
        </div>
        <div className="sm:h-full sm:rounded-r-lg h-[20%] flex flex-col justify-center items-center bg-[url('/blueBack.jpg')] w-full bg-cover ">
          <h1 className='font-poppins text-center text-[1.5rem]'>Welcome Back</h1>
          <Button onClick={() => setShowLogin(!showLogin)}>Register</Button>
        </div>
      </div>
      <div className={`${!showLogin ? 'block' : 'hidden'} w-screen h-screen flex justify-center items-center `}>
            <div className='lg:w-[60%] sm:rounded-lg sm:border-2 sm:shadow-md sm:w-[80%] sm:h-[80%] sm:flex-row flex flex-col  h-full w-full'>
                <div className=" md:w-[50%]  sm:rounded-l-lg sm:w-[50%] sm:h-full mb-5 h-28 bg-[url('/blueBack.jpg')] w-full bg-cover flex flex-col justify-center items-center">                    
                  <p className=" font-poppins font-semibold  text-black" >
                    Welcome Aboard</p>
                  <p className="font-poppins text-black">or</p>
                  <Button 
                    className="hover:scale-125 hover:shadow-lg border-none"
                     onClick={() => setShowLogin(!showLogin)} title="Go Back To Sign In" color='blue' placement='top'>
                     <h2>Login</h2>
                   </Button>
                </div>
                <div className="md:w-[65%] w-full h-full">
                  <Form name="Register"
                      className='h-full  px-2 w-full' 
                      labelCol={
                          {span: 8}
                      }
                      layout="vertical"
                      wrapperCol={
                          {span: 16}
                      }
                      initialValues={
                          {remember: true}
                      }
                      onFinish={handleSubmitRegister}
                      autoComplete="off">
                          <Form.Item 
                            className=" bg-transparent rounded-none border-b-blue-500  border-b-4"
                            name="firstName" label="First Name"
                                  rules={
                                      [{
                                          required: true,
                                          message: 'Please input your First Name!'
                                      }]
                              }>
                                  <Input placeholder='Enter your First Name' 
                                  className="bg-transparent border-none text-base pb-0" />
                          </Form.Item>
                          <Form.Item 
                            className="bg-transparent rounded-none border-b-blue-500  border-b-4"
                            name="lastName" label="Last Name"
                              rules={
                                  [{
                                      required: true,
                                      message: 'Please input your Last Name!'
                                  }]
                              }>
                              <Input placeholder='Enter your Last Name'  
                              className="bg-transparent border-none text-base pb-0"/>
                          </Form.Item>
                          <Form.Item  
                            className='bg-transparent rounded-none border-b-blue-500  border-b-4'
                            name="email" label="Email"
                              rules={
                              [{
                                  type: 'email',
                                  required: true,
                                  message: 'Please input your Email'
                              }]
                          }>
                          <Input  placeholder='Enter your Email'  
                            className="bg-transparent border-none text-base pb-0"/>
                          
                          </Form.Item>               
                          <Form.Item  
                            className='bg-transparent rounded-none border-b-blue-500  border-b-4'
                            name="password" label="Password"
                              rules={
                                  [{
                                      required: true,
                                      message: 'Please input your password!'
                                  }]
                          }>
                              <Input.Password  placeholder='Enter your password' 
                                className="bg-transparent border-none text-base pb-0"/>
                          </Form.Item>
                      <Form.Item  
                            name="gender"
                              rules={
                                  [{
                                      required: true,
                                      message: 'Please input your First Name!'
                                  }]
                          }>
                              <Select
                              className='shadow-lg rounded-full'
                                      style={{width: 200}}
                                      placeholder="Gender"
                                      options={
                                          [
                                              {
                                                  value: true,
                                                  label: 'Male'
                                              }, {
                                                  value: false,
                                                  label: 'Female'
                                              },
                                          ]
                                      }/>
                      </Form.Item>
                      <div className='w-full flex flex-col justify-center items-center'>
                          <Button className='w-full h-12 rounded-md bg-blue-500 text-white shadow-lg' type="primary"  htmlType="submit">
                              Submit
                          </Button>
                      </div>
                  </Form>
                </div>
            </div>
      </div>
     </div>
    </>

  )
}
