import { message } from "antd"
import { PageContext } from "../../lib/context"
import { SettingView } from "./view"

export const Setting = () => {
    const [messageAPI, contextHolder] = message.useMessage()
    const updateUser = async () => {
        try {
            console.log("test")
        } catch (error) {
      showMessage('warning', error.response.data.data)
        }
    }
    const showMessage = (type, content) => {
        messageAPI.open({
          type,
          content,
        })
      }
    const values = {
        updateUser,
        contextHolder
    }
    return (
        <PageContext.Provider value={values}>
            <SettingView />
        </PageContext.Provider>
    )
}
