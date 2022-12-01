import React from 'react'
import { List } from 'antd'
import { Link } from 'react-router-dom'

import ButtonTWP from 'components/common/ButtonTWP'

const ModalContentFF = ({
  data,
  setVis,
  myFollowingList,
  myUser,
  unfollow,
  follow,
}) => (
  <>
    <List
      bordered
      dataSource={data}
      renderItem={(item) => (
        <List.Item>
          <Link
            className="py-1"
            onClick={() => setVis(false)}
            to={`/profile/${item}`}
          >
            {item}
          </Link>
          {console.log(myUser, myFollowingList)}
          {item === myUser ? (
            <></>
          ) : myFollowingList?.includes(item) ? (
            <ButtonTWP text="Unfollow" value={item} onClick={unfollow} />
          ) : (
            <ButtonTWP text="Follow" value={item} onClick={follow} />
          )}
        </List.Item>
      )}
    />
  </>
)
export default ModalContentFF
