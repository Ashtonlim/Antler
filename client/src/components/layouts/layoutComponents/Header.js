import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { Row, Col, Avatar, Badge, Popover } from "antd";
// import { UserOutlined } from "@ant-design/icons";

import GC from "context";
import Autocomplete from "./Autocomplete";
import { getUsers } from "api/user";

const LoggedInOutView = ({ state }) => {
  const [visible, setVisible] = useState(false);
  console.log("state");
  console.log(state);
  const handleVisibleChange = (visible) => {
    setVisible(visible);
  };

  if (state.loggedIn) {
    return (
      <React.Fragment>
        {/* <li className="nav-item">
          <Link to="/watchlist">Watchlist</Link>
        </li> */}
        <Popover
          content={
            <div>
              <li>
                <Link to="/">Portfolio</Link>
              </li>
              <li>
                <Link to="/">Friends</Link>
              </li>
              <li>
                <Link to="/">Research</Link>
              </li>
              <li>
                <Link to="/">Settings</Link>
              </li>
              <li>
                <Link to="/">Dark Mode</Link>
              </li>
              <li>
                <Link to="/logout">Logout</Link>
              </li>
            </div>
          }
          title={`${state.userObj.username.toUpperCase()} - ${
            state.userObj.funds
          } SGD`}
          trigger="hover"
          visible={visible}
          onVisibleChange={handleVisibleChange}
        >
          <span className="avatar-item">
            {state.userObj ? (
              <Link
                to={`/profile/${encodeURIComponent(state.userObj.username)}`}
              >
                <Badge count={1}>
                  <Avatar>{state.userObj.username.slice(0, 1)}</Avatar>
                </Badge>
              </Link>
            ) : (
              <Badge count={1}>
                <Avatar>
                  {" "}
                  <Link to={`/logout`}>user</Link>
                </Avatar>
              </Badge>
            )}
          </span>
        </Popover>

        {/* <li className="nav-item"></li> */}
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
  const { state } = useContext(GC);

  const connect = () => {
    const checkConnection = async () => {
      alert(JSON.stringify(await getUsers()));
    };
    checkConnection();
  };

  return (
    <header className="App-header shadow">
      <Row
        style={{ width: "100%", padding: "0px 20px" }}
        justify="center"
        align="middle"
      >
        <Col xs={{ span: 0 }} md={{ span: 3 }}>
          <Link id="logo" to="/">
            Antler
          </Link>
        </Col>

        <Col xs={{ span: 1 }} md={{ span: 8 }}>
          <Autocomplete />
        </Col>

        <Col xs={{ span: 0 }} md={{ span: 13 }}>
          <nav style={{ justifyContent: "flex-end" }}>
            <ul className="ruRow nav-items">
              {/* remove button in prod */}
              {/* <button onClick={connect}>Test Link</button> */}

              <li className="nav-item">
                <Link to="/">Discover</Link>
              </li>
              <li className="nav-item">
                <Link to="/">Learn</Link>
              </li>
              <li className="nav-item">
                <Link to="/">Portfolio</Link>
              </li>

              <LoggedInOutView state={state} />

              {state.userObj && (
                <li className="nav-item">Funds ${state.userObj.funds}</li>
              )}
            </ul>
          </nav>
        </Col>
      </Row>
    </header>
  );
};

export default Header;
