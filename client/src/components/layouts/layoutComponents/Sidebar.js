import React, { useState } from 'react'
import { Layout, Menu } from 'antd'

const { SubMenu } = Menu
const { Sider } = Layout

const adminMenu = ['Overview', 'Employees', 'Payroll', 'Company Profile']
const personalMenu = ['Personal profile', 'Leave']

export default (props) => {
  const [collapsed, setCollapsed] = useState(false)

  const onCollapse = (state) => {
    setCollapsed(state)
  }

  return (
    <Sider
      collapsible
      collapsed={collapsed}
      onCollapse={onCollapse}
      width={200}
      style={{ borderRight: '1px solid #e6e6e6', marginTop: 65 }}
      className="site-layout-background"
    >
      <Menu
        mode="inline"
        defaultSelectedKeys={['1']}
        defaultOpenKeys={['sub1']}
        style={{ height: '100vh', borderRight: 0 }}
      >
        <SubMenu key="sub1" title="Admin Options">
          {adminMenu.map((item) => (
            <Menu.Item>{item}</Menu.Item>
          ))}
        </SubMenu>
        <SubMenu key="sub2" title="Personal Options">
          {personalMenu.map((item) => (
            <Menu.Item>{item}</Menu.Item>
          ))}
        </SubMenu>
      </Menu>
    </Sider>
  )
}
