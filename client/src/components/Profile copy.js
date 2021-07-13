import { React, useContext, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Button, Avatar, Tag, Divider, Descriptions } from "antd";
import { Link } from "react-router-dom";
import { SmileTwoTone, CheckCircleOutlined } from "@ant-design/icons";

import MainLayout from "./layouts/MainLayout";
import GC from "context";

const Profile = () => {
  const { state } = useContext(GC);
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <MainLayout>
      <section
        style={{
          display: "flex",
          alignItems: "center",
          flexDirection: "column",
        }}
      >
        <Avatar size={64} icon={<SmileTwoTone />} />

        <h1>Hello, {state.userObj.username}</h1>

        <div style={{ display: "flex" }}>
          <h3 style={{ marginRight: "5px" }}>Total Earnings: </h3>
          <Tag color="warning" style={{ height: "100%" }}>
            ${state.userObj.funds}
          </Tag>
        </div>

        <div style={{ display: "flex" }}>
          <h3 style={{ marginRight: "5px" }}>Verification Status: </h3>
          <Tag
            icon={<CheckCircleOutlined />}
            color="green"
            style={{ height: "100%" }}
          >
            Verified
          </Tag>
        </div>

        <Divider style={{ fontSize: 22, marginLeft: 0 }} orientation="left">
          Personal Details
        </Divider>

        <Descriptions>
          <Descriptions.Item label="Name">
            {state.userObj.name}
          </Descriptions.Item>
          <Descriptions.Item label="Contact">
            {state.userObj.phone_num}
          </Descriptions.Item>
          <Descriptions.Item label="email">
            {state.userObj.email}
          </Descriptions.Item>
        </Descriptions>

        <Button block size="large" type="primary">
          <Link to="/logout">Log out</Link>
        </Button>
      </section>
    </MainLayout>
  );
};

export default Profile;
