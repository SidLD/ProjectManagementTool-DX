import { PageContext } from '../../lib/context'
import { RegisterView } from './view'
import { message } from 'antd'
import { register } from '../../lib/api'
import { useNavigate } from 'react-router-dom'

export const Register = () => {
  const [messageAPI, contextHolder] = message.useMessage()
  const navigate = useNavigate()
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
    handleSubmitRegister
  }
  return (
    <PageContext.Provider value={values}>
        <RegisterView />
    </PageContext.Provider>
  )
}