/* eslint-disable react-hooks/exhaustive-deps */
import {Button, Layout} from 'antd'
import {Outlet} from 'react-router-dom'
import {Content, Header} from 'antd/es/layout/layout'
import { useEffect, useState} from 'react';
import {DarkModeSwitch} from 'react-toggle-dark-mode';
import Sider from 'antd/es/layout/Sider';
import { CustomeSider } from '../components/CustomeSider';
import { getNotifications, getProjects } from '../lib/api';
import { AppContext } from '../lib/context';
import { auth } from '../lib/services';
import {Notification} from '../components/Notification'
import OutsideClickHandler from 'react-outside-click-handler';

export const DashboardLayout = () => {
    const theme = localStorage.getItem('theme')
    const user = auth.getUserInfo()
    const [projects, setProjects] = useState([])
    const [showMenu, setShowMenu] = useState(false)
    const [collapsed, setCollapsed] = useState(false);
    const [notification, setNotifications] = useState([])
    const [loader, setLoader] = useState(true)
    const [isDarkMode, setDarkMode] = useState(theme === "dark" ? true : false)
    
    if (theme === "dark") {
        document.documentElement.classList.add('dark')
    } else {
        document.documentElement.classList.remove('dark')
    }

    const toggleDarkMode = () => {
        if (isDarkMode) {
            document.documentElement.classList.remove('dark')
            localStorage.setItem('theme', 'light')
            setDarkMode(false)
        } else {
            document.documentElement.classList.add('dark')
            localStorage.setItem('theme', 'dark')
            setDarkMode(true)
        }
    };

    const handleShowMenu = () => {
        setShowMenu(!showMenu)
    }

    const fetchProject = async (e) => {
        try {
            const payload = {
                name: {
                    contains: e
                },
                managerId: user.id,
                order: {
                    name: 'asc'
                },
                limit: 4,
                start: 0
            }
            const response = await getProjects(payload)
            setProjects(response.data?.data)

        } catch (error) {
          console.log(error)
        }
    }


    const fetchNotification = async () => {
        try {
          const response = await getNotifications({})
          setNotifications(response.data.data)
        } catch (error) {
          console.log(error)
        }
      }

    useEffect(() => {
        fetchNotification()
        fetchProject()
        setLoader(false)
    },[])

    const values = {
        loader,
        fetchNotification,
        notification,
        projects,
        fetchProject
    }

    return (
        <AppContext.Provider value={values}>
         <Layout className='h-screen w-screen'>
                <Sider className='hidden md:block' placement='left' width={250} open={collapsed} onClose={() => setCollapsed(false)}
                    style={{
                        backgroundColor: "black"
                    }}
                    >
                    <CustomeSider />
                </Sider>
                <OutsideClickHandler onOutsideClick={() => setShowMenu(false)}>
                    <div 
                        className={` ${showMenu ? "block": "hidden"} delay-300 ease-out h-screen absolute bg-black z-10 sm:hidden hover:overflow-y-scroll`}
                    >  
                        <CustomeSider />
                    </div>
                </OutsideClickHandler>
                <Layout className='relative'>
                    <Header className=' flex justify-between items-center text-black bg-white dark:bg-slate-800'>
                    <Button className='md:hidden font-poppins text-start text-blue-500 border-none' onClick={handleShowMenu}>Menu</Button>
                    <Notification />
                    <h1 
                        className='dark:shadow-md dark:shadow-blue-500 px-2 rounded-lg hidden md:block dark:text-white uppercase text-sm mr-2 bold sm:text-xl '>
                        Project Management Tool</h1>
                        <DarkModeSwitch className='mr-5'
                            checked={isDarkMode}
                            onChange={toggleDarkMode}
                            size={30}/>
                    </Header>
                        <Content className='overflow-x-hidden m-0 p-0 bg-slate-200 dark:bg-slate-950 '>
                            <Outlet/>
                        </Content>
                </Layout>
            </Layout>
        </AppContext.Provider>
    )
}
