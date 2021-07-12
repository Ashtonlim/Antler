import React from "react";
import { Row, Col } from "antd";
import MainLayout from "./layouts/MainLayout";

const Home = () => {
  return (
    <MainLayout>
      <section>
        <h1>Welcome to Antler</h1>

        <Row md={{ span: 24 }} xl={{ span: 10 }}>
          <section>
            <Row className="mtb-5">
              <Col span={3}>
                <img
                  alt="social"
                  src="https://image.flaticon.com/icons/png/512/2065/2065157.png"
                />
              </Col>
              <Col span={16} className="ml-3">
                <h3>Discuss About Companies and Discover Great Research</h3>
                <p>
                  Post your analysis on compnaies and find what others have to
                  say about your favourite companies
                </p>
              </Col>
            </Row>
            <Row className="mtb-5">
              <Col span={3}>
                <img
                  alt="investing"
                  src="https://image.flaticon.com/icons/png/512/2737/2737448.png"
                />
              </Col>
              <Col span={16} className="ml-3">
                <h3>Antler Makes Investing Simple</h3>
                <p>
                  Most brokerage platforms are too complicated. We're focused on
                  the best investing experience for retail investors
                </p>
              </Col>
            </Row>
            <Row className="mtb-5">
              <Col span={3}>
                <img
                  alt="Reporting"
                  src="https://image.flaticon.com/icons/png/512/3280/3280890.png"
                />
              </Col>
              <Col span={16} className="ml-3">
                <h3>Track your Investments</h3>
                <p>
                  Reports and analysis to help track your investments and
                  provide insights.
                </p>
              </Col>
            </Row>
          </section>
        </Row>
      </section>
    </MainLayout>
  );
};

export default Home;
