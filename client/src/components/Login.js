import React, { useState, useEffect, useContext } from 'react';
import { Redirect, Link } from 'react-router-dom';

import { Form, Input, Button, Checkbox } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';

import MainLayout from './layouts/MainLayout';
import GC from 'context';
import { loginUser } from 'api/user';
import { LOGIN } from 'actionTypes';

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

  const { state, dispatch } = useContext(GC);

  useEffect(() => {});

  const [form] = Form.useForm();

  const handleInput = (e) => {
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
    console.log('Failed:', errorInfo);
  };

  if (state.loggedIn) return <Redirect to="/" />;

  return (
    <MainLayout>
      <div>
        <section id="loginP">
          <div className="card">
            <h1>Login</h1>
            <Form
              // {...formItemLayout}
              layout="vertical"
              form={form}
              initialValues={{
                remember: true,
              }}
              onFinish={onFinish}
              onFinishFailed={onFinishFailed}
              size="large"
              requiredMark={false}
            >
              <Form.Item
                label="Username or email"
                name="username"
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
                name="password"
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
                <Button type="primary" htmlType="submit">
                  Submit
                </Button>
              </Form.Item>
            </Form>
            <Link to="/forgetpassword">Forget Password?</Link>
          </div>
        </section>
      </div>
    </MainLayout>
  );
};
export default Login;
