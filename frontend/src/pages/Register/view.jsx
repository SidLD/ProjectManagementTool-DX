import {useContext} from 'react'
import {PageContext} from '../../lib/context'

import {Button, Form, Input, Select} from 'antd';
import { useNavigate } from 'react-router-dom';


export const RegisterView = () => {
    const {contextHolder, handleSubmitRegister} = useContext(PageContext)
    const navigate = useNavigate()
    return (
        <div className='h-screen w-screen flex justify-center items-center  '>
            {contextHolder}
            <Form name="Register"
                labelCol={
                    {span: 8}
                }
                wrapperCol={
                    {span: 16}
                }
                style={
                    {maxWidth: 600}
                }
                initialValues={
                    {remember: true}
                }
                onFinish={handleSubmitRegister}
                autoComplete="off">
                <div className='flex'>
                    <Form.Item label="First Name" name="firstName"
                        rules={
                            [{
                                required: true,
                                message: 'Please input your First Name!'
                            }]
                    }>
                        <Input/>
                    </Form.Item>
                    <Form.Item label="Gender" name="gender"
                        rules={
                            [{
                                required: true,
                                message: 'Please input your First Name!'
                            }]
                    }>
                        <Select
                                style={
                                    {width: 120}
                                }
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
                </div>
                <Form.Item label="Last Name" name="lastName"
                    rules={
                        [{
                            required: true,
                            message: 'Please input your Last Name!'
                        }]
                    }>
                    <Input/>
                </Form.Item>
                <Form.Item label="Email" name="email"
                    rules={
                        [{
                            type: 'email',
                            required: true,
                            message: 'Please input your Email!'
                        }]
                }>
                    <Input/>
                </Form.Item>
                <Form.Item label="Password" name="password"
                    rules={
                        [{
                            required: true,
                            message: 'Please input your password!'
                        }]
                }>
                    <Input.Password/>
                </Form.Item>
                <div className='flex justify-between mx-20'>
                    <Form.Item wrapperCol={
                        {
                            offset: 8,
                            span: 16
                        }
                    }>
                        <Button className='bg-gray-700' type="primary"  htmlType="submit">
                            Submit
                        </Button>
                    </Form.Item>
                    <Form.Item wrapperCol={
                        {
                            offset: 8,
                            span: 16
                        }
                    }>
                        <Button className='bg-gray-700' type="primary"
                            onClick={() => {
                                navigate("/login")
                            }}
                        >
                            Go to Sign
                        </Button>
                    </Form.Item>
                </div>
            </Form>
        </div>
    )
}