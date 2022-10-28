import React from 'react'
import { List } from 'antd'
import { Link } from 'react-router-dom'

import ButtonTWP from 'components/common/ButtonTWP'

const ModalContentFF = ({ data, setVis }) => (
  <>
    <List
      bordered
      dataSource={data}
      renderItem={(item) => (
        <List.Item>
          <Link onClick={() => setVis(false)} to={`/profile/${item}`}>
            {item}
          </Link>
          <ButtonTWP text="unfollow" />
        </List.Item>
      )}
    />
  </>
)
export default ModalContentFF
