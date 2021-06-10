import React, { useState } from 'react';
import { Redirect } from 'react-router-dom';
import { Form, Input, Button } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined } from '@ant-design/icons';
import MainLayout from './layouts/MainLayout';

const Register = () => {
  const [vals, setVals] = useState({
    email: '',
    username: '',
    password: '',
    repassword: '',
  });

  const [form] = Form.useForm();

  const handleInput = (e) => {
    let { name, val } = e.target;
    setVals({ ...vals, [name]: val });
  };

  const onFinish = (values) => {
    console.log('Success:', values);
  };

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  if (false) {
    return <Redirect to={this.state.redirect} />;
  } else
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
                remember: true,
              }}
              onFinish={onFinish}
              onFinishFailed={onFinishFailed}
              size="large"
              requiredMark={false}
            >
              <Form.Item
                label="Email"
                name="Email"
                rules={[
                  {
                    type: 'email',
                    message: 'The input is not valid E-mail!',
                  },
                  {
                    required: true,
                    message: 'Please input your Email!',
                  },
                ]}
              >
                <Input
                  placeholder="Email"
                  value={vals.Email}
                  onChange={handleInput}
                  prefix={<MailOutlined />}
                />
              </Form.Item>
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
                name="Re-type password"
                label="Re-type password"
                dependencies={['password']}
                hasFeedback
                rules={[
                  {
                    required: true,
                    message: 'Please Re-type your password!',
                  },
                  ({ getFieldValue }) => ({
                    validator(rule, value) {
                      // getFieldValue is case-sensitive
                      if (!value || getFieldValue('Password') === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(
                        'The two passwords that you entered do not match!'
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
