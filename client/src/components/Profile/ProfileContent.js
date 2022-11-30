import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import dayjs from 'dayjs'
import ButtonTWP from 'components/common/ButtonTWP'
import Modal from 'components/common/Modal'
import ModalContentFF from './ModalContentFF'
import ModalContentPosts from './ModalContentPosts'

import { FOLLOW_USER, UNFOLLOW_USER } from 'actionTypes'
import { api_unfollowUser, api_followUser } from 'api/user'
import { api_GetPosts } from 'api/stock'

let relativeTime = require('dayjs/plugin/relativeTime')
dayjs.extend(relativeTime)

const ProfileContent = ({
  dispatch,
  userInfo,
  isMyProfile,
  setVisible,
  myFollowingList,
  myFollowersList,
}) => {
  const [ffModalVisible, setFFModalVisible] = useState(false)
  const [postsModalVisible, setPostsModalVisible] = useState(false)
  const [title, setTitle] = useState('Followers')
  const [data, setData] = useState(myFollowingList)

  const [comments, setComments] = useState([])

  useEffect(() => {
    const getComments = async () => {
      try {
        const commentsRes = await api_GetPosts('ABNB')
        console.log(commentsRes)
        setComments(
          commentsRes.comments.map(({ postText, author, createdAt }) => ({
            author: <Link to={`/profile/${author}`}>{author}</Link>,
            content: <p>{postText}</p>,
            datetime: dayjs(createdAt).fromNow(),
            ticker: 'ABNB',
          }))
        )
      } catch (err) {
        console.log(err)
      }
    }
    getComments()
    // does not refresh when change stock
  }, [])

  const showFollowers = () => {
    setTitle('Followers')
    setFFModalVisible(true)
    setData(myFollowersList)
  }

  const showFollowing = () => {
    setTitle('Following')
    setData(myFollowingList)
    setFFModalVisible(true)
  }

  const showPosts = () => {
    setPostsModalVisible(true)
  }

  const follow = async () => {
    try {
      dispatch({
        type: FOLLOW_USER,
        payload: await api_followUser({ username: userInfo?.username }),
      })
    } catch (err) {
      alert(err)
    }
  }

  const unfollow = async () => {
    try {
      dispatch({
        type: UNFOLLOW_USER,
        payload: await api_unfollowUser({ username: userInfo?.username }),
      })
    } catch (err) {
      alert(err)
    }
  }
  return (
    <section className="relative py-16">
      <Modal
        title={title}
        visible={ffModalVisible}
        setVisible={setFFModalVisible}
      >
        <ModalContentFF data={data} setVis={setFFModalVisible} />
      </Modal>
      <Modal
        title="Posts"
        visible={postsModalVisible}
        setVisible={setPostsModalVisible}
      >
        <ModalContentPosts data={comments} setVis={setPostsModalVisible} />
      </Modal>

      <div className="container mx-auto px-4">
        <div className="augDM relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-xl rounded-lg -mt-64">
          <div className="px-6">
            <div className="flex flex-wrap justify-center">
              <div className="w-full lg:w-3/12 lg:order-2 flex justify-center">
                <img
                  alt="Profile"
                  src="https://imgur.com/4l2Vc4V.png"
                  className="shadow-xl rounded-full h-auto border-none -mt-20"
                  style={{
                    width: '150px',
                    height: '150px',
                    maxWidth: '150px',
                  }}
                />
              </div>
              <div className="w-full lg:w-4/12 px-4 lg:order-3 lg:text-right lg:self-center text-center">
                {isMyProfile ? (
                  <div className="py-6 px-3 mt-32 sm:mt-0">
                    <ButtonTWP
                      text="Add funds"
                      onClick={() => {
                        setVisible(true)
                      }}
                    />
                  </div>
                ) : (
                  <div className="py-6 px-3 mt-32 sm:mt-0">
                    {console.log(
                      { myFollowingList },
                      userInfo?.username,
                      myFollowingList.includes(userInfo?.username)
                    )}
                    {myFollowingList.includes(userInfo?.username) ? (
                      <ButtonTWP text="Unfollow" onClick={unfollow} />
                    ) : (
                      <ButtonTWP text="Follow" onClick={follow} />
                    )}
                  </div>
                )}
              </div>
              <div className="w-full lg:w-4/12 px-4 lg:order-1">
                <div className="flex justify-center py-4 lg:pt-4 pt-8">
                  {isMyProfile && (
                    <div className="mr-4 p-3 text-center">
                      <span className="text-xl font-bold block uppercase tracking-wide text-gray-700">
                        ${userInfo.funds ? userInfo.funds : 0}
                      </span>
                      <span className="text-sm text-gray-500">Funds</span>
                    </div>
                  )}
                  <div className="mr-4 p-3 text-center" onClick={showFollowers}>
                    <span className="text-xl font-bold block uppercase tracking-wide text-gray-700">
                      {userInfo?.followers ? userInfo.followers.length : 0}
                    </span>
                    <span className="text-sm text-gray-500">Followers</span>
                  </div>
                  <div className="mr-4 p-3 text-center" onClick={showFollowing}>
                    <span className="text-xl font-bold block uppercase tracking-wide text-gray-700">
                      {userInfo?.following ? userInfo.following.length : 0}
                    </span>
                    <span className="text-sm text-gray-500">Following</span>
                  </div>
                  <div className="lg:mr-4 p-3 text-center" onClick={showPosts}>
                    <span className="text-xl font-bold block uppercase tracking-wide text-gray-700">
                      0
                    </span>
                    <span className="text-sm text-gray-500">Posts</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="text-center mt-4">
              <h3 className="text-4xl font-semibold leading-normal mb-2 text-gray-800 mb-2">
                {userInfo?.name?.toUpperCase()}
              </h3>

              {isMyProfile && (
                <>
                  <div className="text-sm leading-normal mt-0 mb-2 text-gray-500 font-bold uppercase">
                    {userInfo?.email}
                  </div>
                  <div className="mb-2 text-gray-700">
                    Phone Number: {userInfo?.phone_num}
                  </div>
                </>
              )}
              <div className="mb-2 text-gray-700">Lorum epsum</div>
            </div>{' '}
            <div className="mt-10 py-10 text-center">
              <div className="flex flex-wrap justify-center">
                {isMyProfile && (
                  <div className="py-6 px-3 mt-32 sm:mt-0">
                    <Link
                      className="eDM align-middle bg-blue-500 hover:bg-blue-600 uppercase text-white font-bold hover:shadow-md hover:text-white px-4 py-2 rounded outline-none focus:outline-none mb-1"
                      to="/logout"
                      style={{ transition: 'all .15s ease' }}
                    >
                      Logout
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default ProfileContent
