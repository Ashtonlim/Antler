import React, { Fragment } from "react";
import { Row, Col } from "antd";

import Header from "./layoutComponents/Header";
import MobileNavbar from "./layoutComponents/MobileNavbar";
import Footer from "./layoutComponents/Footer";

const MainLayout = ({ children }) => (
  <>
    <Header />
    <div id="mainContent">
      <Row justify="center">
        <Col xs={{ span: 20 }}>
          <main>
            <Fragment>{children}</Fragment>
          </main>
        </Col>
        <Col xs={{ span: 24 }} md={{ span: 0 }}>
          <MobileNavbar />
        </Col>
        <Col xs={{ span: 0 }} md={{ span: 24 }}>
          <Footer />
        </Col>
      </Row>
    </div>
  </>
);

export default MainLayout;
