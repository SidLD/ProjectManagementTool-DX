import { auth } from "./services.js"
export const dataHeader = () => {
    return { headers: { "x-access-token": auth.getToken() } }
}
export const TaskStatusColor = (item) => {
    let color = ""
    let nextColor = ""
    let text = ""
    let border =""
    let backGroundColor = ""
    switch (item.status) {
        case "IN PROGRESS": 
            color = "text-yellow-500"
            nextColor = "bg-green-500"
            backGroundColor = "bg-yellow-500"
            text = "Click to Complete Task"
            border = "border-b-8 border-yellow-500"
            break;
        case "TO DO": 
            color = "text-blue-500"
            backGroundColor = "bg-blue-500"
            nextColor = "bg-yellow-500"
            text = "Click to set In Progress Task"
            border = " border-b-8 border-blue-500"
            break;

        default: 
            color = "text-green-500"
            backGroundColor = "bg-green-500"
            nextColor = "bg-blue-500"
            text = "Click to set To Do Task"
            border = " border-b-8 border-green-500"
            break;
    }
    return {
        text,
        backGroundColor,
        color,
        nextColor,
        border
    }
}
export const generateRandomStringColor = () => {
    const colors = ['blue', 'green', 'red']
    return colors[Math.floor(Math.random()*colors.length)]
}
export const formatDate = (date) => {
    const localDate = new Date(date)
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const dayNames = ['Mon', 'Tue', 'Wed', 'Thur', 'Fri', 'Sat', 'Sun']
    return {
        day: dayNames[localDate.getDay()],
        month: monthNames[localDate.getMonth()],
        year: localDate.getFullYear(),
        min: localDate.getMinutes(),
        hour: localDate.getHours()
    }
}