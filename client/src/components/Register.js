import React, { useState, useContext } from "react";
import { Redirect } from "react-router-dom";

import { Form, Input, Button } from "antd";
import { UserOutlined, LockOutlined, MailOutlined } from "@ant-design/icons";

import MainLayout from "./layouts/MainLayout";
import GC from "context";
import { registerUser } from "api/user";
import { LOGIN } from "actionTypes";

const Register = () => {
  const [vals, setVals] = useState({
    email: "",
    username: "",
    password: "",
    repassword: "",
    name: "",
    phone_num: "",
  });

  const { state, dispatch } = useContext(GC);
  const [form] = Form.useForm();

  const handleInput = (e) => {
    let { name, val } = e.target;
    setVals({ ...vals, [name]: val });
  };

  const onFinish = async (values) => {
    console.log("Success:", values);

    delete values.repassword;
    try {
      dispatch({
        type: LOGIN,
        payload: await registerUser({ ...values }),
      });
    } catch (err) {
      alert("@register.js" + err + "change this to proper err on frontend");
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed@register.js:", errorInfo);
  };

  if (state.loggedIn) return <Redirect to="/" />;

  return (
    <MainLayout>
      <section id="loginP">
        <div className="card">
          <h1>Register</h1>
          <Form
            // {...formItemLayout}
            layout="vertical"
            form={form}
            initialValues={{
              remember: false,
            }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            size="large"
            requiredMark={false}
          >
            <Form.Item
              label="Email"
              name="email"
              rules={[
                {
                  type: "email",
                  message: "The input is not valid E-mail!",
                },
                {
                  required: true,
                  message: "Please input your Email!",
                },
              ]}
            >
              <Input
                placeholder="Email"
                value={vals.email}
                onChange={handleInput}
                prefix={<MailOutlined />}
              />
            </Form.Item>
            <Form.Item
              label="Username"
              name="username"
              rules={[
                {
                  required: true,
                  message: "Please input your username!",
                },
              ]}
            >
              <Input
                placeholder="Username"
                value={vals.username}
                onChange={handleInput}
                prefix={<UserOutlined />}
              />
            </Form.Item>

            <Form.Item
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
                placeholder="Password"
                value={vals.password}
                onChange={handleInput}
                prefix={<LockOutlined />}
              />
            </Form.Item>

            <Form.Item
              label="Re-type password"
              name="repassword"
              dependencies={["password"]}
              hasFeedback
              rules={[
                {
                  required: true,
                  message: "Please Re-type your password!",
                },
                ({ getFieldValue }) => ({
                  validator(rule, value) {
                    // getFieldValue is case-sensitive
                    if (!value || getFieldValue("password") === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(
                      "The two passwords that you entered do not match!"
                    );
                  },
                }),
              ]}
            >
              <Input.Password
                placeholder="Re-type password"
                value={vals.password}
                onChange={handleInput}
                prefix={<LockOutlined />}
              />
            </Form.Item>

            <Form.Item
              label="Name"
              name="name"
              rules={[
                {
                  required: true,
                  message: "Please input your name!",
                },
              ]}
            >
              <Input
                placeholder="name"
                value={vals.name}
                onChange={handleInput}
                prefix={<UserOutlined />}
              />
            </Form.Item>

            <Form.Item
              label="Phone Number"
              name="phone_num"
              rules={[
                {
                  required: true,
                  message: "Please input your phone number!",
                },
              ]}
            >
              <Input
                addonBefore="+65"
                value={vals.phone_num}
                onChange={handleInput}
                style={{ width: "100%" }}
              />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit">
                Submit
              </Button>
            </Form.Item>
          </Form>
        </div>
      </section>
    </MainLayout>
  );
};

export default Register;
