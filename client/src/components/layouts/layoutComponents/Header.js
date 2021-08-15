import React, { useContext, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Row, Col, Avatar, Badge, Popover, Switch } from "antd";
// import { CloseOutlined, CheckOutlined, UserOutlined } from "@ant-design/icons";

import Autocomplete from "./Autocomplete";
import GC from "context";
import { TOGGLE_DARK_MODE } from "actionTypes";

const LoggedInOutView = ({ loggedIn, userObj }) => {
  const [visible, setVisible] = useState(false);

  const handleVisibleChange = (visible) => {
    setVisible(visible);
  };

  if (loggedIn) {
    return (
      <>
        <Popover
          content={
            <div>
              <li>
                <Link to="/portfolio">Portfolio</Link>
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
                <Link to="/logout">Logout</Link>
              </li>
            </div>
          }
          title={`${userObj?.username?.toUpperCase()} - ${userObj?.funds} SGD`}
          placement="bottom"
          trigger="hover"
          visible={visible}
          onVisibleChange={handleVisibleChange}
        >
          <span className="avatar-item">
            {userObj ? (
              <Link to={`/profile/${encodeURIComponent(userObj?.username)}`}>
                <Badge count={1}>
                  <Avatar>{userObj?.username?.slice(0, 1)}</Avatar>
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
      </>
    );
  }
  return (
    <>
      <li className="nav-item">
        <Link to="/login">Login</Link>
      </li>
      <li className="nav-item">
        <Link to="/register">Register</Link>
      </li>
    </>
  );
};

const Header = () => {
  const { state, dispatch } = useContext(GC);

  const toggleDarkModeStyle = (darkMode) => {
    if (darkMode) {
      const style = document.createElement("style");
      style.setAttribute("class", "customDarkMode");
      style.innerHTML = `html, img, footer, .eDM {filter: invert(1) hue-rotate(180deg);} 
      .App-header, 
      .card, 
      .augDM, 
      .ant-modal-root div.ant-modal-content-rmtoallow {background-color: #ddd; box-shadow: none;}
      .augDMNoBg {box-shadow: none} .augDMNoBg:focus {box-shadow: none;}`;
      document.head.appendChild(style);
    } else {
      const l = document.querySelectorAll(".customDarkMode");
      for (var i = 0; i < l.length; i++) {
        l[i].remove();
      }
    }
  };

  const toggleDarkModeState = (darkMode = false) => {
    dispatch({ type: TOGGLE_DARK_MODE, payload: { darkMode } });
    toggleDarkModeStyle(darkMode);
  };
  useEffect(() => {
    toggleDarkModeStyle(state.darkMode);
  }, [state.darkMode]);

  return (
    <header className="App-header bg-white">
      <Row
        style={{ width: "100%", padding: "0px 20px" }}
        justify="center"
        align="middle"
      >
        <Col xs={{ span: 0 }} lg={{ span: 3 }}>
          <Link id="logo" to="/">
            Antler
          </Link>
        </Col>

        <Col xs={{ span: 24 }} md={{ span: 10 }} lg={{ span: 8 }}>
          <Autocomplete />
        </Col>

        <Col xs={{ span: 0 }} md={{ span: 14 }} lg={{ span: 13 }}>
          <nav style={{ justifyContent: "flex-end" }}>
            <ul className="ruRow nav-items">
              <Switch
                checkedChildren="Dark"
                unCheckedChildren="Light"
                checked={state.darkMode || false}
                onClick={toggleDarkModeState}
              />

              <li className="nav-item">
                <Link to="/">Discover</Link>
              </li>
              <li className="nav-item">
                <Link to="/">Learn</Link>
              </li>
              <li className="nav-item">
                <Link to="/portfolio">Portfolio</Link>
              </li>

              <LoggedInOutView
                loggedIn={state.loggedIn}
                userObj={state.userObj}
              />

              {state.userObj?.funds >= 0 ? (
                <li className="nav-item">Funds ${state.userObj?.funds}</li>
              ) : (
                ""
              )}
            </ul>
          </nav>
        </Col>
      </Row>
    </header>
  );
};

export default Header;
