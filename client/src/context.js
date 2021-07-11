import React, { useReducer } from "react";

import { LOGIN, LOGIN_REJECTED, LOGOUT, TOGGLE_DARK_MODE } from "./actionTypes";
import { saveState, loadState } from "./localStorage";
const GC = React.createContext();

const user = loadState();

// uses something similar to redux pattern.
// google redux for more info
const reducer = (state = {}, action) => {
  switch (action.type) {
    case LOGIN:
      const loginState = { ...state, ...action.payload, loggedIn: true };
      saveState(loginState);
      console.log("From reducers.js, LOG_IN");
      return loginState;
    case LOGIN_REJECTED:
      console.log("From reducers.js, LOG_IN_REJECTED");
      return { ...state, ...action.payload };
    case LOGOUT:
      // const logoutState = { loggedIn: false, username: 'not logged in' }
      const logoutState = { ...state, loggedIn: false };
      saveState(logoutState);
      return logoutState;
    case TOGGLE_DARK_MODE:
      const mode = { ...state, ...action.payload };

      const items = ["html", "img", "footer"];
      items.forEach((tag) => {
        let l = document.getElementsByTagName(tag);
        for (var i = 0; i < l.length; i++) {
          l[i].classList.toggle("darkMode");
        }
      });

      // if (action.payload.darkMode) {

      // } else {

      // }

      saveState(mode);
      return mode;
    default:
      return state;
  }
};

// allows different component to access state held in a context
export const ContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, user);
  return <GC.Provider value={{ state, dispatch }}>{children}</GC.Provider>;
};

export default GC;
