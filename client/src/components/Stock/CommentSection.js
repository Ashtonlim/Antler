import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Avatar, Button, Comment, Form, Input, List } from 'antd'
import dayjs from 'dayjs'

let relativeTime = require('dayjs/plugin/relativeTime')
dayjs.extend(relativeTime)

const { TextArea } = Input

const CommentList = ({ comments }) => (
  <List
    dataSource={comments}
    header={`${comments.length} ${comments.length > 1 ? 'replies' : 'reply'}`}
    itemLayout="horizontal"
    renderItem={(props) => <Comment {...props} />}
  />
)
const Editor = ({ onChange, onSubmit, submitting, value }) => (
  <>
    <Form.Item>
      <TextArea rows={4} onChange={onChange} value={value} />
    </Form.Item>
    <Form.Item>
      <Button
        htmlType="submit"
        loading={submitting}
        onClick={onSubmit}
        type="primary"
      >
        Add Comment
      </Button>
    </Form.Item>
  </>
)
const App = () => {
  const [comments, setComments] = useState([])
  const [submitting, setSubmitting] = useState(false)
  const [value, setValue] = useState('')
  const handleSubmit = () => {
    if (!value) return
    setSubmitting(true)
    setTimeout(() => {
      setSubmitting(false)
      setValue('')
      setComments([
        ...comments,
        {
          author: 'Han Solo',
          avatar: 'https://joeschmoe.io/api/v1/random',
          content: <p>{value}</p>,
          datetime: dayjs('1999-01-01').fromNow(),
        },
      ])
    }, 1000)
  }
  const handleChange = (e) => {
    setValue(e.target.value)
  }
  return (
    <>
      {comments.length > 0 && <CommentList comments={comments} />}
      <Comment
        avatar={
          <Avatar src="https://joeschmoe.io/api/v1/random" alt="Han Solo" />
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
export default App

// const Top = ({ children }) => (
//   <Comment
//     actions={[<span key="comment-nested-reply-to">Reply to</span>]}
//     author={<Link>Han Solo</Link>}
//     content={
//       <p>
//         We supply a series of design principles, practical patterns and high
//         quality design resources (Sketch and Axure).
//       </p>
//     }
//   >
//     {children}
//   </Comment>
// )
// const CommentSection = () => (
//   <ExampleComment>
//     <ExampleComment>
//       <ExampleComment />
//       <ExampleComment />
//     </ExampleComment>
//   </ExampleComment>
// )
// export default CommentSection
