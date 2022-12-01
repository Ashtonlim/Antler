import React, { useContext, useState, useEffect } from 'react'

import GC from 'context'
import { api_addFunds, getUsers } from 'api/user'
import { DEPOSIT_FUNDS } from 'actionTypes'
import { expiresIn } from 'consts'
import { currF } from 'utils/format'

import MainLayout from 'components/layouts/MainLayout'
import NotificationPopups from 'components/common/NotificationPopups'
import Modal from 'components/common/Modal'
import ButtonTWP from 'components/common/ButtonTWP'
import ModalContentAddFunds from './ModalContentAddFunds'
import ProfileContent from './ProfileContent'

const { REACT_APP_NAME } = process.env

const Profile = ({ match }) => {
  const { state, dispatch } = useContext(GC)
  const [userInfo, setUserInfo] = useState({})
  const [depositVal, setDepositVal] = useState('1.00')
  const [msgList, setMsgList] = useState([])
  const [addFundsModalVisible, setAddFundsModalVisible] = useState(false)

  // check if I am looking at my own profile or another user's one.
  const [isMyProfile, setIsMyProfile] = useState(false)

  useEffect(() => {
    const pn = match.url.split('/').pop().toLowerCase()

    const initData = async () => {
      try {
        if (state.userObj?.username?.toLowerCase() === pn) {
          setIsMyProfile(true)
          setUserInfo(state.userObj)
        } else {
          setIsMyProfile(false)
          setUserInfo(await getUsers(pn))
        }
      } catch (err) {
        alert(err)
      }
    }

    // console.log(
    //   { pn, match, isMyProfile },
    //   state.userObj?.username?.toUpperCase(),
    // );
    initData()
    document.title = `${pn} Profile | ${REACT_APP_NAME}`
  }, [match, state, isMyProfile])

  const removeEnded = (listOfPopups) => {
    // once items in msgList expires, remove it
    // calculated by seeing if current time is past > initialised at time + duration to exists
    return listOfPopups.reduce((acc, msg) => {
      if (msg.iat + msg.expiresIn > Date.now()) {
        acc.push(msg)
      }
      return acc
    }, [])
  }

  const depositFunds = async () => {
    console.log({ depositVal })
    try {
      dispatch({
        type: DEPOSIT_FUNDS,
        payload: await api_addFunds({ value: depositVal }),
      })

      console.log(msgList)
      setMsgList([
        // Review: Not ideal, only clears msgList if user deposits funds again.
        ...removeEnded(msgList),
        {
          type: 'success',
          message: `${currF(depositVal)} was deposited to your Account`,
          iat: Date.now(),
          expiresIn,
        },
      ])
      // setVisible(false);
    } catch ({ message }) {
      console.log(msgList)
      setMsgList([
        ...removeEnded(msgList),
        { type: 'error', message, iat: Date.now(), expiresIn },
      ])
    }
  }

  return (
    <MainLayout width="24">
      {msgList.length && (
        <div className="fixed z-10 flex flex-col items-start pt-4 mt-12">
          {msgList.map((msg) => (
            <NotificationPopups
              key={msg.iat}
              type={msg.type}
              message={msg.message}
              iat={msg.iat}
              expiresIn={msg.expiresIn}
            />
          ))}
        </div>
      )}
      {/* Review: move into profile content? */}
      {isMyProfile && (
        <Modal
          title="Fund Your Account"
          visible={addFundsModalVisible}
          setVisible={setAddFundsModalVisible}
          msgList={msgList}
          setMsgList={setMsgList}
          footerButtons={[
            <ButtonTWP
              key={1}
              onClick={depositFunds}
              text={`Add ${currF(depositVal)} to your account`}
            />,
          ]}
        >
          <ModalContentAddFunds
            depositVal={depositVal}
            setDepositVal={setDepositVal}
          />
        </Modal>
      )}
      <div className="profile-page -mt-24">
        <section className="relative block" style={{ height: '500px' }}>
          <div
            className="eDM absolute top-0 w-full h-full bg-center bg-cover"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1499336315816-097655dcfbda?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2710&q=80')",
            }}
          >
            <span
              id="blackOverlay"
              className="w-full h-full absolute opacity-50 bg-black"
            ></span>
          </div>
        </section>
        <ProfileContent
          dispatch={dispatch}
          userObj={state.userObj}
          isMyProfile={isMyProfile}
          setVisible={setAddFundsModalVisible}
          myFollowingList={state?.userObj?.following}
          myFollowersList={state?.userObj?.followers}
        />
      </div>
    </MainLayout>
  )
}

export default Profile
