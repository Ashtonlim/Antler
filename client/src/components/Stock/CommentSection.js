import React, { useState, useEffect, useContext } from 'react'
import dayjs from 'dayjs'
import { Link } from 'react-router-dom'
import { Avatar, Button, Comment, Form, Input, List } from 'antd'

import GC from 'context'
import ButtonTWP from 'components/common/ButtonTWP'
import { POST_ON_STOCK } from 'actionTypes'
import { api_GetPosts, api_CreatePost } from 'api/stock'

let relativeTime = require('dayjs/plugin/relativeTime')
dayjs.extend(relativeTime)

const { TextArea } = Input
// const avatar = 'https://joeschmoe.io/api/v1/random'

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
          avatar={
            <Avatar src="https://joeschmoe.io/api/v1/random" alt="Username" />
          }
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
      <ButtonTWP text="Login to Comment"></ButtonTWP>
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
          ? ` - ${comments.length} Replies`
          : comments.length
          ? ` - ${comments.length} Reply`
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
  const { dispatch } = useContext(GC)
  const [comments, setComments] = useState([])
  const [submitting, setSubmitting] = useState(false)
  const [value, setValue] = useState('')

  const retrievePosts = async () => {
    setComments(
      (await api_GetPosts(ticker)).map(({ postText, author, createdAt }) => ({
        author: <Link to={`/profile/${author}`}>{author}</Link>,
        avatar: 'https://joeschmoe.io/api/v1/random',
        content: <p>{postText}</p>,
        datetime: dayjs(createdAt).fromNow(),
      }))
    )
  }

  useEffect(() => {
    console.log(dayjs())
    const getComments = async () => {
      try {
        await retrievePosts()
      } catch (err) {
        console.log(err)
      }
    }
    getComments()
    // does not refresh when change stock
  }, [ticker])

  const handleSubmit = async () => {
    if (!value) return

    try {
      dispatch({
        type: POST_ON_STOCK,
        payload: await api_CreatePost({
          ticker,
          author: userObj.username,
          postText: value,
        }),
      })

      setSubmitting(true)
      setTimeout(async () => {
        setSubmitting(false)
        setValue('')
        await retrievePosts()
      }, 1000)
    } catch ({ message }) {
      console.log(message)
    }
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
