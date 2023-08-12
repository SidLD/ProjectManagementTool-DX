import { PageContext } from '../../lib/context.js'
import { LoginView } from './view.jsx'
import { message } from 'antd'
import { login } from '../../lib/api.js'
import { auth } from '../../lib/services.js'
import { useNavigate } from 'react-router-dom'
import io from "socket.io-client";
//Need to add this before the component decleration
const socket = io(`${import.meta.env.VITE_API_URL}`,{
         transports: ["websocket"] });
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
            const decodedData = auth.decode(data?.data?.token)
            socket.emit('login', decodedData.id)
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
        handleSubmitLogin,
        navigate
    }
    return (
        <PageContext.Provider value={values}>
            <LoginView />
        </PageContext.Provider>
    )
}