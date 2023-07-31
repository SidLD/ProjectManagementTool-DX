import {
    Button,
    Select,
    Form,
    Input,
    InputNumber
} from 'antd';
import { useContext } from 'react';
import { PageContext } from '../../lib/context';
export const SettingView = () => {
    const { updateUser, form, contextHolder} = useContext(PageContext)
  return (
    <>
        {contextHolder}
     <div className='mt-2 flex justify-center'>
        <Form 
          labelCol={
                {span: 6}
            }
            wrapperCol={
                {span: 18}
            }
            labelAlign="right"
            initialValues={
                {remember: true}
            }
            onFinish={updateUser}
            
          form={form}
            style={
                {
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    width: '50%',
                }
                
        }>
            <Form.Item label="Year Batch" name="batch"
               
                style={
                    {width: "100%"}
            }>
               <InputNumber min={2000}
                    max={2030}/>
            </Form.Item>
            <Form.Item label="Email" name="email"
                rules={
                    [{
                            type: "email",
                            required: true,
                            message: "Please input your Email"
                        }]
                }
                style={
                    {width: "100%"}
            }>
                <Input />
            </Form.Item>
            <Form.Item label="First Name" name="firstName"
                rules={
                    [{
                            required: true,
                            message: "Please input your First Name"
                        }]
                }
                style={
                    {width: "100%"}
            }>
                <Input/>
            </Form.Item>

            <Form.Item label="MiddleName" name="middleName"

                style={
                    {width: "100%"}
            }>
                <Input/>
            </Form.Item>
            <Form.Item label="Last Name" name="lastName"
                rules={
                    [{
                            required: true,
                            message: "Please input your last name"
                        }]
                }
                style={
                    {width: "100%"}
            }>
                <Input/>
            </Form.Item>

            <Form.Item label="Age" name="age"
                rules={
                    [{
                            required: true,
                            message: "Please input your age"
                        }]
                }
                style={
                    {width: "100%"}
            }>
                <InputNumber min={1}
                    max={99}
                    value={3}/>
            </Form.Item>

            <Form.Item label="Gender" name="gender"
                rules={
                    [{
                            required: true,
                            message: "Please input your gender"
                        }]
                }
                style={
                    {width: "100%"}
            }>
                <Select value="male"
                    style={
                        {width: 120}
                    }
                    options={
                        [
                            {
                                value: 'male',
                                label: 'Male'
                            }, {
                                value: 'female',
                                label: 'Female'
                            },
                        ]
                    }/>
            </Form.Item>
            <Button type="primary" htmlType="submit"
                style={
                    {width: "50%",
                    color: 'black',
                    border: '1px solid green'
                }
            }>
                Update
            </Button>
        </Form>
    </div>
    </>
  )
}
