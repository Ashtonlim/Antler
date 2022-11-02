import React from 'react'
import { List, Comment } from 'antd'
import { Link } from 'react-router-dom'

const ModalContentPosts = ({ data, setVis }) => (
  <>
    {console.log(data)}
    <List
      bordered
      dataSource={data}
      // renderItem={(item) => <List.Item>{item}</List.Item>}
      renderItem={(props) => (
        <div className="m-5">
          <span>
            Posted on <Link to="stocks/ABNB">ABNB</Link>
          </span>
          <Comment {...props} />
        </div>
      )}
    />
  </>
)
export default ModalContentPosts

// const CommentList = ({ comments }) => (
//   <List
//     dataSource={comments}
//     itemLayout="horizontal"
//     renderItem={(props) => <Comment {...props} />}
//     locale={{ emptyText: 'Be the first to comment :)' }}
//   />
// )
