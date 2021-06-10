import React, { Fragment } from 'react'
import { Row, Col } from 'antd'

import Header from './layoutComponents/Header'
import Sidebar from './layoutComponents/Sidebar'
import MobileNavbar from './layoutComponents/MobileNavbar'

const SidebarLayout = ({ children }) => (
  <>
    <Header />
    <Row justify="center">
      <Col xs={{ span: 0 }} lg={{ span: 6 }}>
        <Sidebar />
      </Col>
      <Col xs={{ span: 24 }} lg={{ span: 18 }}>
        <main>
          <Fragment>{children}</Fragment>
        </main>
      </Col>
      <Col xs={{ span: 24 }} lg={{ span: 0 }}>
        <MobileNavbar />
      </Col>
    </Row>
  </>
)

export default SidebarLayout
