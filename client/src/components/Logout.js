import React, { useContext, useEffect } from 'react'
import { Redirect } from 'react-router-dom'
import GC from 'context'
import { LOGOUT } from 'actionTypes'
const { REACT_APP_NAME } = process.env

const Logout = () => {
  const { dispatch } = useContext(GC)
  useEffect(() => {
    document.title = `Logging out | ${REACT_APP_NAME}`
    dispatch({ type: LOGOUT })
  })

  return <Redirect to="/" />
}

export default Logout
