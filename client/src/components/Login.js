import React, { useState, useEffect, useContext } from "react";
import { Redirect, Link } from "react-router-dom";

import { Form, Input, Button, Checkbox, Row, Col } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";

import MainLayout from "./layouts/MainLayout";
import GC from "context";
import { loginUser } from "api/user";
import { LOGIN } from "actionTypes";

const Login = () => {
  const [form] = Form.useForm();
  const [vals, setVals] = useState({
    username: "",
    password: "",
    usernameReqPF: false,
    pwdReqPF: false,
    errMsg: "",
    redirect: null,
    loginErrMsg: "",
  });

  const { state, dispatch } = useContext(GC);

  useEffect(() => {
    document.title = "Log In | Antler";
    // this is to add background img
    const mainContentEle = document.querySelector("#mainContent");
    if (mainContentEle) {
      mainContentEle.classList.add("bgsx1");
    }
  });

  const handleInput = (e) => {
    console.log(vals);
    let { name, val } = e.target;
    setVals({ ...vals, [name]: val });
  };

  const onFinish = async (values) => {
    delete values.remember; // temp
    try {
      dispatch({ type: LOGIN, payload: await loginUser(values) });
    } catch (err) {
      alert(err);
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  if (state.loggedIn) return <Redirect to="/" />;

  return (
    <MainLayout>
      <Row>
        <Col
          xs={{ span: 24 }}
          md={{ span: 18 }}
          lg={{ span: 13 }}
          xl={{ span: 10 }}
        >
          <section id="loginP">
            <div className="card mb-3">
              <h1>Login</h1>

              <Form
                layout="vertical"
                form={form}
                initialValues={{
                  remember: true,
                }}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                size="medium"
                requiredMark={false}
              >
                <Form.Item
                  label="Username or email"
                  name="username"
                  rules={[
                    {
                      required: true,
                      message: "Please input your username!",
                    },
                  ]}
                >
                  <Input
                    size="large"
                    placeholder="Username"
                    // value={vals.username}
                    onChange={handleInput}
                    prefix={<UserOutlined />}
                  />
                </Form.Item>

                <Form.Item
                  style={{ marginBottom: 0 }}
                  label="Password"
                  name="password"
                  rules={[
                    {
                      required: true,
                      message: "Please input your password!",
                    },
                  ]}
                >
                  <Input.Password
                    size="large"
                    placeholder="Password"
                    value={vals.password}
                    onChange={handleInput}
                    prefix={<LockOutlined />}
                  />
                </Form.Item>
                <div className="mb-2">
                  <Link to="/forgetpassword">Forgot Password?</Link>
                </div>

                <Form.Item
                  // buttonItemLayout={null}
                  name="remember"
                  valuePropName="checked"
                >
                  <Checkbox>Remember me</Checkbox>
                </Form.Item>

                <Form.Item>
                  <Button block size="large" type="primary" htmlType="submit">
                    Submit
                  </Button>
                </Form.Item>
              </Form>
              <p>
                Don't have an account? <Link to="/register">Sign up here.</Link>
              </p>
              <Button block size="large" type="primary"></Button>
            </div>
          </section>
        </Col>

        <Col md={{ span: 9 }} xl={{ span: 10 }}>
          <section>
            <h2>Start Investing at Antler</h2>
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
        </Col>
      </Row>
    </MainLayout>
  );
};
export default Login;
