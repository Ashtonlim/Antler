import React, { useState, useContext, useEffect } from 'react'
import { Navigate, Link } from 'react-router-dom'

import { Form, Input, Button, Row, Col } from 'antd'
import { UserOutlined, LockOutlined, MailOutlined } from '@ant-design/icons'

import MainLayout from './layouts/MainLayout'
import GC from 'context'
import { registerUser } from 'api/user'
import { LOGIN } from 'actionTypes'

const { REACT_APP_NAME } = process.env

const Register = () => {
  const [vals, setVals] = useState({
    email: '',
    username: '',
    password: '',
    repassword: '',
    name: '',
    phone_num: '',
  })

  const [emailIsOk, setEmailIsOk] = useState([true, ''])

  const { state, dispatch } = useContext(GC)
  const [form] = Form.useForm()

  useEffect(() => {
    document.title = `Register | ${REACT_APP_NAME}`
    const mainContentEle = document.querySelector('#mainContent')
    if (mainContentEle) {
      mainContentEle.classList.add('bgsx1')
    }
  })

  const handleInput = (e) => {
    let { name, val } = e.target
    setVals({ ...vals, [name]: val })
  }

  const onFinish = async (values) => {
    console.log('Success:', values)

    delete values.repassword
    try {
      const payload = await registerUser({ ...values })
      console.log(`from reg ${payload}`)
      if (payload) {
        dispatch({ type: LOGIN, payload })
      }
    } catch (err) {
      alert('@register.js' + err + 'change this to proper err on frontend')
      setEmailIsOk([true, err])
    }
  }

  const onFinishFailed = (errorInfo) => {
    console.log('Failed@register.js:', errorInfo)
    setEmailIsOk([true, errorInfo])
  }

  if (state.loggedIn) return <Navigate to="/" />

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
            <div className="card">
              <h1>Register</h1>
              <Form
                layout="vertical"
                form={form}
                initialValues={{
                  remember: false,
                }}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                size="medium"
                requiredMark={false}
              >
                <Form.Item
                  label="Email"
                  name="email"
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
                    size="large"
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
                      message: 'Please input your username!',
                    },
                  ]}
                >
                  <Input
                    size="large"
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
                    size="large"
                    placeholder="Password"
                    value={vals.password}
                    onChange={handleInput}
                    prefix={<LockOutlined />}
                  />
                </Form.Item>

                <Form.Item
                  label="Re-type password"
                  name="repassword"
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
                        if (!value || getFieldValue('password') === value) {
                          return Promise.resolve()
                        }
                        return Promise.reject(
                          'The two passwords that you entered do not match!'
                        )
                      },
                    }),
                  ]}
                >
                  <Input.Password
                    size="large"
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
                      message: 'Please input your name!',
                    },
                    {
                      pattern: new RegExp(/^[a-zA-Z`_=+\']+$/i),
                      message: 'Only alphabets allowed',
                    },
                  ]}
                >
                  <Input
                    size="large"
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
                      message: 'Please input your phone number!',
                    },
                  ]}
                >
                  <Input
                    size="large"
                    addonBefore="+65"
                    value={vals.phone_num}
                    onChange={handleInput}
                    style={{ width: '100%' }}
                  />
                </Form.Item>

                <Form.Item>
                  <Button
                    className="mt-5"
                    size="large"
                    type="primary"
                    htmlType="submit"
                  >
                    Register Account
                  </Button>
                </Form.Item>
              </Form>
              <p>
                Already have account? <Link to="/login">Login here.</Link>
              </p>
            </div>
          </section>
        </Col>

        <Col md={{ span: 9 }} xl={{ span: 11 }}>
          <section className="ml-5">
            <h2>Start Investing at {REACT_APP_NAME}</h2>
            <Row className="mtb-5">
              <Col span={3}>
                <img alt="social" src="https://i.imgur.com/xMwZoiP.png" />
              </Col>
              <Col span={16} className="ml-3">
                <h3>Discuss About Companies and Discover Great Research</h3>
                <p>
                  Post your analysis on companies and find what others have to
                  say about your favourite companies
                </p>
              </Col>
            </Row>
            <Row className="mtb-5">
              <Col span={3}>
                <img alt="investing" src="https://i.imgur.com/3OtXZOg.png" />
              </Col>
              <Col span={16} className="ml-3">
                <h3>{REACT_APP_NAME} Makes Investing Simple</h3>
                <p>
                  Most brokerage platforms are too complicated. We're focused on
                  the best investing experience for retail investors
                </p>
              </Col>
            </Row>
            <Row className="mtb-5">
              <Col span={3}>
                <img alt="Reporting" src="https://i.imgur.com/n6npIbv.png" />
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
  )
}

export default Register
