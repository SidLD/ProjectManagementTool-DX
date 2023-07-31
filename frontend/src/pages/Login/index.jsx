import { PageContext } from '../../lib/context.js'
import { LoginView } from './view.jsx'
import { message } from 'antd'
import { login } from '../../lib/api.js'
import { auth } from '../../lib/services.js'
export const Login = () => {
    const [messageAPI, contextHolder] = message.useMessage()

    const handleSubmitLogin = async (e) => {
        try {
            const payload = {
                email: e.email,
                password: e.password
            }
            const data = await login(payload)
            auth.storeToken("Bearer "+data.data.token)
        } catch (error) {
            warningMessage(error.response.data.data)
        }
    }

    const warningMessage = (message) => {
        messageAPI.open({
            type:'warning',
            content:message 
        })
    }
    const values = {
        contextHolder,
        handleSubmitLogin
    }
    return (
        <PageContext.Provider value={values}>
            <LoginView />
        </PageContext.Provider>
    )
}