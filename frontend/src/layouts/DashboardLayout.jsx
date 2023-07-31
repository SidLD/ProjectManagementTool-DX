import {Button, Layout, Menu, Tooltip} from 'antd'
import {Outlet, useNavigate} from 'react-router-dom'
import {Content, Header} from 'antd/es/layout/layout'
import {
    DashboardOutlined,
    LogoutOutlined,
    UserOutlined,
    MenuUnfoldOutlined,
    MenuFoldOutlined
} from '@ant-design/icons';
import {auth} from "../lib/services.js";
import Sider from 'antd/es/layout/Sider.js';
import {useState} from 'react';
export const DashboardLayout = () => {
    const user = auth.getUserInfo()
    const navigate = useNavigate()
    const [collapsed, setCollapsed] = useState(false);
    const onCollapse = () => setCollapsed(!collapsed)
    const items = [
        {
            key: "dashboard",
            label: "Dashboard",
            icon: <DashboardOutlined/>}, {
            key: "tasks",
            label: "Tasks",
            icon: <DashboardOutlined/>}, {
            key: "setting",
            icon: <UserOutlined/>,
            label: "User Setting"
        },
        // {
        // key: "logout",
        // icon: <LogoutOutlined />,
        // label: "Logout",
        // },
    ];
    const onClick = (e) => {
        navigate(e.key)
    }
    const tooglDarkMode = () => {
        document.documentElement.classList.remove('dark')
    }

    return (
        <div className='h-screen dark:bg-black bg-slate-50'>

            <Layout className='dark bg-slate-50'>
                <Sider collapsed={collapsed}
                    onCollapse={onCollapse}>
                    <div className='bg-slate-50 text-black p-2 text-center text-lg'>
                        <h1 className='uppercase '>
                            {
                            user.firstName
                        }
                            {
                            user.lastName
                        }</h1>
                    </div>
                    <Menu className='bg-slate-50 text-black h-full flex-row justify-center content-center items-center'
                        onClick={onClick}
                        mode='inline'
                        defaultSelectedKeys={
                            ['dashboard']
                        }
                        items={
                            items.map((item) => ({key: item.key, icon: item.icon, label: item.label}))
                        }/>
                </Sider>
                <Layout>
                    <Header className='flex justify-between items-center  text-black bg-slate-50'>
                        <Tooltip className="hidden md:block" placement='leftBottom'
                            title={
                                collapsed ? 'Show Menu' : 'Hide Menu'
                            }
                            color='blue'>
                            <Button onClick={onCollapse}>
                                {
                                collapsed ? <MenuUnfoldOutlined/>: <MenuFoldOutlined/>
                            } </Button>
                        </Tooltip>
                        
                        {/* <Button onClick={tooglDarkMode} className='dark:bg-slate-950'>Dark Mode</Button> */}
                        <h1 className='uppercase text-sm mr-2 bold sm:text-2xl'>Project Management Tool</h1>
                        <Tooltip placement='rightTop' title='Logout' color='blue'>
                            <Button onClick={
                                () => navigate('/logout')
                            }>
                                <LogoutOutlined/>
                            </Button>
                        </Tooltip>
                    </Header>
                    <Content className='m-0 p-0 bg-slate-200 h-screen rounded-xl '>
                        <Outlet/>
                    </Content>
                </Layout>
            </Layout>
        </div>
    )
}
