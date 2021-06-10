import React, { useState } from "react";
import {
  HomeOutlined,
  PieChartOutlined,
  SettingOutlined,
  UserOutlined,
  FileOutlined,
} from "@ant-design/icons";

const menu = [
  { icon: <HomeOutlined />, tab: "Home" },
  { icon: <FileOutlined />, tab: "Feed" },
  { icon: <PieChartOutlined />, tab: "Markets" },
  { icon: <UserOutlined />, tab: "Account" },
  { icon: <SettingOutlined />, tab: "Settings" },
];

const MobileNavbar = () => {
  const [sel, setSel] = useState("Home");
  const handleClick = (e) => {
    setSel(e.currentTarget.innerText);
  };
  return (
    <section className="mobileNavbar">
      <div className="container">
        <nav className="bottom-nav">
          {menu &&
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
            ))}
        </nav>
      </div>
    </section>
  );
};

export default MobileNavbar;
