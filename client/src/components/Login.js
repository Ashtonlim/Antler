import React, { useState } from 'react';
import { Redirect } from 'react-router-dom';
import { Form, Input, Button, Checkbox } from 'antd';

import { UserOutlined, LockOutlined } from '@ant-design/icons';

import MainLayout from './layouts/MainLayout';

const Login = () => {
  const [vals, setVals] = useState({
    username: '',
    password: '',
    usernameReqPF: false,
    pwdReqPF: false,
    errMsg: '',
    redirect: null,
    loginErrMsg: '',
  });

  const [form] = Form.useForm();

  const onLogin = () => {
    console.log('login');
  };
  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  const handleInput = (e) => {
    let { name, val } = e.target;
    setVals({ ...vals, [name]: val });
  };

  if (false) {
    return <Redirect to={this.state.redirect} />;
  } else
    return (
      <MainLayout>
        <div>
          <section id="loginP">
            <div className="card">
              <h1>Login</h1>
              <Form
                layout="vertical"
                form={form}
                initialValues={{
                  remember: true,
                }}
                onFinish={onLogin}
                onFinishFailed={onFinishFailed}
                size="large"
                requiredMark={false}
              >
                <Form.Item
                  label="Username"
                  name="Username"
                  rules={[
                    {
                      required: true,
                      message: 'Please input your username!',
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
                  name="Password"
                  rules={[
                    {
                      required: true,
                      message: 'Please input your password!',
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
                  // buttonItemLayout={null}
                  name="remember"
                  valuePropName="checked"
                >
                  <Checkbox>Remember me</Checkbox>
                </Form.Item>

                <Form.Item>
                  <Button type="primary">Submit</Button>
                </Form.Item>
              </Form>
            </div>
          </section>
        </div>
      </MainLayout>
    );
};

export default Login;
