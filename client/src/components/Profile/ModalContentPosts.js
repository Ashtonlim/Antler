import React from 'react'
import { List, Comment } from 'antd'

const ModalContentPosts = ({ data }) => (
  <>
    {console.log(data)}
    <List
      bordered
      dataSource={data}
      // renderItem={(item) => <List.Item>{item}</List.Item>}
      renderItem={(props) => (
        <div className="mx-5 ">
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
