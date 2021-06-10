import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { Row, Col } from 'antd';

import GC from 'context';
import Autocomplete from './Autocomplete';
import { getUsers } from 'api/user';

const LoggedInOutView = () => {
  const { state } = useContext(GC);

  if (state.loggedIn) {
    return (
      <React.Fragment>
        <li className="nav-item">
          <Link to="/watchlist">Watchlist</Link>
        </li>
        <li className="nav-item">
          {state.userObj ? (
            <Link to={`/profile/${encodeURIComponent(state.userObj.username)}`}>
              {state.userObj.username}
            </Link>
          ) : (
            <div>missingUsername</div>
          )}
        </li>
        <li className="nav-item">
          <Link to="/logout">Logout</Link>
        </li>
      </React.Fragment>
    );
  }
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
};

const Header = () => {
  const connect = () => {
    const checkConnection = async () => {
      alert(JSON.stringify(await getUsers()));
    };
    checkConnection();
  };

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
              {/* remove button in prod */}
              <button onClick={connect}>Test Server Connection</button>
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
