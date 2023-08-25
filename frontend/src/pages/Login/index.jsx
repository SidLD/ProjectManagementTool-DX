import { PageContext } from '../../lib/context.js'
import { message } from 'antd'
import { login, register } from '../../lib/api.js'
import { auth } from '../../lib/services.js'
import { useNavigate } from 'react-router-dom'
import {LoginRegisterView} from './view.jsx'

export const Login = () => {
    const [messageAPI, contextHolder] = message.useMessage()
    const navigate = useNavigate()

    const handleSubmitLogin = async (e) => {
        try {
            const payload = {
                email: e.email,
                password: e.password
            }
            const data = await login(payload)
      
            auth.storeToken("Bearer "+data.data.token)
            
        } catch (error) {
            showMessage( 'warning',error.response.data.data)
        }
    }

    const handleSubmitRegister = async (e) => {
        try {
          const payload = {
            email : e.email,
            password: e.password,
            firstName: e.firstName,
            lastName: e.lastName,
            gender: e.gender,
          }
          const response = await register(payload)
          if(response.data.ok){
            showMessage('success', 'Success')
            navigate("/login")
          }
        } catch (error) {
          showMessage('warning', error.response.data.message)
        }
    }

    const showMessage = (type, content) => {
      messageAPI.open({
        type,
        content,
      })
    }

    const values = {
        contextHolder,
        handleSubmitLogin,
        handleSubmitRegister,
        navigate
    }
    return (
        <PageContext.Provider value={values}>
            <LoginRegisterView />
        </PageContext.Provider>
    )
}