import {useContext} from 'react'
import {PageContext} from '../../lib/context'

import {Button, Form, Input, Select, Tooltip} from 'antd';
import { useNavigate } from 'react-router-dom';


export const RegisterView = () => {
    const {contextHolder, handleSubmitRegister} = useContext(PageContext)
    const navigate = useNavigate()
    return (
        <>
        {contextHolder}
        <Tooltip title="Go Back To Sign In" color='blue' placement='right'>
            <svg  onClick={() => navigate('/login')} className="h-20 w-20 text-blue-500 cursor-pointer hover:scale-110 delay-200"  width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">  <path stroke="none" d="M0 0h24v24H0z"/>  <line x1="5" y1="12" x2="19" y2="12" />  <line x1="5" y1="12" x2="9" y2="16" />  <line x1="5" y1="12" x2="9" y2="8" /></svg>
        </Tooltip>
        <div className='h-full w-screen flex justify-center items-center px-2'>
            <Form name="Register"
                className='p-2 w-full ' 
                labelCol={
                    {span: 8}
                }
                wrapperCol={
                    {span: 16}
                }
                initialValues={
                    {remember: true}
                }
                onFinish={handleSubmitRegister}
                autoComplete="off">
                <Form.Item name="firstName"
                        rules={
                            [{
                                required: true,
                                message: 'Please input your First Name!'
                            }]
                    }>
                        <Input placeholder='Last Name' className='h-10 border-2 rounded-full shadow-lg'/>
                    </Form.Item>
                <Form.Item  name="lastName"
                    rules={
                        [{
                            required: true,
                            message: 'Please input your Last Name!'
                        }]
                    }>
                    <Input placeholder='Last Name'  className='h-10 border-2 rounded-full shadow-lg'/>
                </Form.Item>
                
                <Form.Item  name="gender"
                        rules={
                            [{
                                required: true,
                                message: 'Please input your First Name!'
                            }]
                    }>
                        <Select
                         className='shadow-lg rounded-full'
                                style={
                                    {width: 120}
                                }
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
                <Form.Item  name="email"
                    rules={
                        [{
                            type: 'email',
                            required: true,
                            message: 'Please input your Email!'
                        }]
                }>
                    <Input  placeholder='Email' className='h-10 border-2 rounded-full shadow-lg'/>
                </Form.Item>
                <Form.Item  name="password"
                    rules={
                        [{
                            required: true,
                            message: 'Please input your password!'
                        }]
                }>
                    <Input.Password  placeholder='Password' className='h-10 border-2 rounded-full shadow-lg'/>
                </Form.Item>
                <Button className='w-full h-12 rounded-full bg-blue-500 text-white shadow-lg' type="primary"  htmlType="submit">
                    Submit
                </Button>
            </Form>
        </div>
    </>
    )
}