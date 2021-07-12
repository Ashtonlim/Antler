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
      // REVIEW: I cannot figure for the life of me why this adds <style> to head TWICE!! console log only occurs once
      // if (action.payload.darkMode) {
      //   const style = document.createElement("style");
      //   const r = Math.random().toString(36).substring(7);
      //   style.setAttribute("class", "customDarkMode " + r);
      //   style.innerHTML = `html,img,footer .${r} {filter: invert(1) hue-rotate(180deg);} .card, .shadow {background: #eee; box-shadow: none}`;
      //   console.log("TOGGLE_DARK_MODE", action.payload.darkMode);
      //   document.head.appendChild(style);
      // } else {
      //   const l = document.querySelectorAll(".customDarkMode");
      //   for (var i = 0; i < l.length; i++) {
      //     l[i].remove();
      //   }
      // }

      const mode = { ...state, ...action.payload };
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
