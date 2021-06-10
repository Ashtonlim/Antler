import React from 'react';
import { Link } from 'react-router-dom';
import { Row, Col } from 'antd';
import Autocomplete from './Autocomplete';

const LoggedInOutView = (props) => {
  if (false) {
    return (
      <React.Fragment>
        <li className="nav-item">
          <Link to="/portfolio">portfolio</Link>
        </li>
        <li className="nav-item"></li>
      </React.Fragment>
    );
  } else {
    return (
      <React.Fragment>
        <li className="nav-item">
          <Link to="/login">Login</Link>
        </li>
        <li className="nav-item">
          <Link to="/register">Register</Link>
        </li>
      </React.Fragment>
    );
  }
};

const Header = () => {
  return (
    <header className="App-header shadow">
      <Row
        style={{ width: '100%', padding: '0px 20px' }}
        justify="center"
        align="middle"
      >
        <Col xs={{ span: 6 }} md={{ span: 2 }}>
          <Link id="logo" to="/">
            App
          </Link>
        </Col>

        <Col xs={{ span: 18 }} md={{ span: 12 }}>
          <Autocomplete />
        </Col>

        <Col xs={{ span: 0 }} md={{ span: 10 }}>
          <nav style={{ justifyContent: 'flex-end' }}>
            <ul className="ruRow nav-items">
              <li className="nav-item">
                <Link to="/">Item 1</Link>
              </li>

              <LoggedInOutView />
            </ul>
          </nav>
        </Col>
      </Row>
    </header>
  );
};

export default Header;
