import React, { useState, useEffect } from 'react'
import dayjs from 'dayjs'
import { Link } from 'react-router-dom'
import { Avatar, Button, Comment, Form, Input, List } from 'antd'

import ButtonTWP from 'components/common/ButtonTWP'
import { api_GetStockComment, api_PostComment } from 'api/stock'

let relativeTime = require('dayjs/plugin/relativeTime')
dayjs.extend(relativeTime)

const { TextArea } = Input
const avatar = 'https://joeschmoe.io/api/v1/random'

const LoggedInOutView = ({
  loggedIn,
  handleChange,
  handleSubmit,
  submitting,
  value,
}) => {
  if (loggedIn) {
    return (
      <>
        <Comment
          avatar={<Avatar src={avatar} alt="Username" />}
          content={
            <Editor
              onChange={handleChange}
              onSubmit={handleSubmit}
              submitting={submitting}
              value={value}
            />
          }
        />
      </>
    )
  }
  return (
    <Link to="/login">
      <ButtonTWP text="Login to Trade"></ButtonTWP>
    </Link>
  )
}

const CommentList = ({ comments }) => (
  <List
    dataSource={comments}
    header={
      <div>
        <span className="text-xl">Comments</span>
        {comments.length > 1
          ? `- ${comments.length} Replies`
          : comments.length
          ? `- ${comments.length} Reply`
          : ' '}
      </div>
    }
    itemLayout="horizontal"
    renderItem={(props) => <Comment {...props} />}
    locale={{ emptyText: 'Be the first to comment :)' }}
  />
)
const Editor = ({ onChange, onSubmit, submitting, value }) => (
  <>
    <Form.Item>
      <TextArea rows={4} onChange={onChange} value={value} />
    </Form.Item>
    <Form.Item style={{ marginBottom: '0' }}>
      <Button
        htmlType="submit"
        loading={submitting}
        onClick={onSubmit}
        type="primary"
      >
        Post Comment
      </Button>
    </Form.Item>
  </>
)
const CommentSection = ({ ticker, loggedIn, userObj }) => {
  const [comments, setComments] = useState([])
  const [submitting, setSubmitting] = useState(false)
  const [value, setValue] = useState('')

  useEffect(() => {
    const getComments = async () => {
      try {
        const commentsRes = await api_GetStockComment(ticker)
        console.log(commentsRes)
        setComments(
          commentsRes.comments.map(({ postText, author, createdAt }) => ({
            author: <Link to={`/profile/${author}`}>{author}</Link>,
            avatar,
            content: <p>{postText}</p>,
            datetime: dayjs(createdAt).fromNow(),
            // datetime: dayjs().fromNow(),
          }))
        )
      } catch (err) {
        console.log(err)
      }
    }
    getComments()
    // setComments({comments: })
  })

  const handleSubmit = async () => {
    if (!value) return

    const res = await api_PostComment({
      ticker,
      comments: { author: userObj.username, postText: value },
    })
    console.log(res)

    setSubmitting(true)
    setTimeout(() => {
      setSubmitting(false)
      setValue('')
      setComments([
        ...comments,
        {
          author: (
            <Link to={`/profile/${userObj.username}`}>{userObj.username}</Link>
          ),
          avatar,
          content: <p>{value}</p>,
          datetime: dayjs().fromNow(),
        },
      ])
    }, 1000)
  }
  const handleChange = (e) => {
    setValue(e.target.value)
  }

  return (
    <div className="card flex flex-col space-around justify-between mb-3 w-4/12">
      <CommentList comments={comments} />

      <LoggedInOutView
        loggedIn={loggedIn}
        comments={comments}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
        submitting={submitting}
        value={value}
      />
    </div>
  )
}
export default CommentSection
