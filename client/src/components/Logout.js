import React, { useContext, useEffect } from 'react';
import { Redirect } from 'react-router-dom';
import GC from 'context';
import { LOGOUT } from 'actionTypes';

const Logout = () => {
  const { dispatch } = useContext(GC);
  useEffect(() => {
    document.title = 'Logging out | Antler';
    dispatch({ type: LOGOUT });
  });

  return <Redirect to="/" />;
};

export default Logout;
