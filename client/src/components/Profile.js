import { React, useContext, useEffect } from "react";
import { useLocation } from "react-router-dom";
import {
  Button,
  Avatar,
  Tag,
  Divider,
  Collapse,
  Descriptions,
  Upload,
} from "antd";
import { Link } from "react-router-dom";
import {
  SmileTwoTone,
  CheckCircleOutlined,
  StarOutlined,
  UploadOutlined,
  SyncOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";

import MainLayout from "./layouts/MainLayout";
import GC from "context";

const { Panel } = Collapse;

const Profile = () => {
  const { state } = useContext(GC);
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  const props = {
    action: "https://www.mocky.io/v2/5cc8019d300000980a055e76",
    onChange({ file, fileList }) {
      if (file.status !== "uploading") {
        console.log(file, fileList);
      }
    },
    defaultFileList: [
      {
        uid: "1",
        name: "Travel Declaration.png",
        status: "done",
        response: "Server Error 500", // custom error message to show
        url: "http://www.baidu.com/xxx.png",
      },
      {
        uid: "2",
        name: "NRIC Front and Back.png",
        status: "done",
        url: "http://www.baidu.com/yyy.png",
      },
    ],
    showUploadList: {
      showDownloadIcon: true,
      downloadIcon: "download ",
      showRemoveIcon: true,
      removeIcon: (
        <StarOutlined
          onClick={(e) => console.log(e, "custom removeIcon event")}
        />
      ),
    },
  };

  return (
    <MainLayout>
      <section
        style={{
          display: "flex",
          "align-items": "center",
          "flex-direction": "column",
        }}
      >
        <Avatar size={64} icon={<SmileTwoTone />} />

        <h1>Hello, {state.userObj.username}</h1>

        <div style={{ display: "flex" }}>
          <h3 style={{ "margin-right": "5px" }}>Country: </h3>
          <Tag color="warning" style={{ height: "100%" }}>
            {state.userObj.home_country}
          </Tag>
        </div>

        <div style={{ display: "flex" }}>
          <h3 style={{ "margin-right": "5px" }}>Vaccination Status: </h3>
          <Tag
            icon={<CheckCircleOutlined />}
            color="green"
            style={{ height: "100%" }}
          >
            Vaccinated
          </Tag>
        </div>

        <Divider
          style={{ "font-size": 22, "margin-left": 0, width: "100%" }}
          orientation="left"
        >
          Upcoming Trips
        </Divider>
        <Collapse style={{ width: "100%" }}>
          <Panel
            header="India"
            key="1"
            extra={
              <Tag icon={<CheckCircleOutlined />} color="success">
                Completed
              </Tag>
            }
          >
            <p>All documents submitted. You are ready to go!</p>
          </Panel>
          <Panel
            header="Malaysia"
            key="2"
            extra={
              <Tag icon={<SyncOutlined spin />} color="processing">
                Processing
              </Tag>
            }
          >
            <p>Awaiting a response from the Malaysian Government.</p>
          </Panel>
          <Panel
            header="China"
            key="3"
            extra={
              <Tag icon={<ClockCircleOutlined />} color="default">
                Awaiting Documents
              </Tag>
            }
          >
            <p>
              Please submit your travel declaration form for further processing.
            </p>
          </Panel>
        </Collapse>

        <Divider
          style={{ "font-size": 22, "margin-left": 0 }}
          orientation="left"
        >
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
          <Descriptions.Item label="Address">
            Block 1 Depot Rd, The Villa, #06-90 Singapore 109679
          </Descriptions.Item>
        </Descriptions>

        <Divider
          style={{ "font-size": 22, "margin-left": 0 }}
          orientation="left"
        >
          My Documents
        </Divider>

        <div style={{ width: "100%", "margin-bottom": "25px" }}>
          <Upload {...props}>
            <Button icon={<UploadOutlined />}>Upload</Button>
          </Upload>
        </div>

        <Button block size="large" type="primary">
          <Link to="/logout">Log out</Link>
        </Button>
      </section>
    </MainLayout>
  );
};

export default Profile;
