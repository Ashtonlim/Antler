import React, { useState, useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  HomeOutlined,
  PieChartOutlined,
  StockOutlined,
  UserOutlined,
  FileOutlined,
} from "@ant-design/icons";

import GC from "context";

const MobileNavbar = () => {
  const { pathname } = useLocation();
  const [sel, setSel] = useState(pathname);

  const handleClick = (e) => {
    setSel(e.currentTarget.innerText);
  };

  const { state } = useContext(GC);
  return (
    <section className="mobileNavbar">
      <div className="container">
        <nav className="bottom-nav">
          {/* {menu &&
            menu.map(({ icon, tab }, key) => (
              <div
                key={key}
                onClick={handleClick}
                className={`bottom-nav-item ${sel === tab ? "active" : ""}`}
              >
                <div className="bottom-nav-link">
                  {icon}
                  <span>{tab}</span>
                </div>
              </div>
            ))} */}
          <nav className="bottom-nav">
            <Link
              onClick={handleClick}
              className={`bottom-nav-item ${sel === "/" ? "active" : ""}`}
              to={`/`}
            >
              <div className="bottom-nav-link">
                <HomeOutlined />
                <span>Home</span>
              </div>
            </Link>
            <Link
              onClick={handleClick}
              className={`bottom-nav-item ${sel === "/feed" ? "active" : ""}`}
              to={`/feed`}
            >
              <div className="bottom-nav-link">
                <FileOutlined />
                <span>Feed</span>
              </div>
            </Link>
            <Link
              onClick={handleClick}
              className={`bottom-nav-item ${
                sel === "/markets" ? "active" : ""
              }`}
              to={`/markets`}
            >
              <div className="bottom-nav-link">
                <StockOutlined />
                <span>Markets</span>
              </div>
            </Link>
            <Link
              onClick={handleClick}
              className={`bottom-nav-item ${
                sel === "/portfolio" ? "active" : ""
              }`}
              to={`/portfolio`}
            >
              <div className="bottom-nav-link">
                <PieChartOutlined />
                <span>Portfolio</span>
              </div>
            </Link>
            {state.loggedIn && (
              <Link
                onClick={handleClick}
                className={`bottom-nav-item ${
                  sel.includes("/profile") ? "active" : ""
                }`}
                to={`/profile/${state.userObj.name}`}
              >
                <div className="bottom-nav-link">
                  <UserOutlined />
                  <span>Profile</span>
                </div>
              </Link>
            )}
            {!state.loggedIn && (
              <Link
                onClick={handleClick}
                className={`bottom-nav-item ${
                  sel === "/login" ? "active" : ""
                }`}
                to={`/login`}
              >
                <div className="bottom-nav-link">
                  <UserOutlined />
                  <span>LogIn</span>
                </div>
              </Link>
            )}
          </nav>
        </nav>
      </div>
    </section>
  );
};

export default MobileNavbar;
