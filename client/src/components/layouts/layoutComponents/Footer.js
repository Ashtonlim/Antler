import React from 'react';
import { Row, Col } from 'antd';

function Footer() {
  return (
    <footer className="site-footer">
      <Row
        style={{ width: '100%', padding: '0px 20px' }}
        justify="center"
        align="middle"
      >
        <Col xs={{ span: 24 }} md={{ span: 4 }}>
          <span>App</span>
        </Col>

        <Col xs={{ span: 24 }} md={{ span: 20 }}>
          <span className="copyright-text">
            Copyright &copy; All Rights Reserved by
            <a href="/"> y2stud</a>
          </span>
        </Col>
      </Row>
    </footer>
  );
}

export default Footer;
