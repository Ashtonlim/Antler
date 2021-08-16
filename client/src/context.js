import React, { useReducer } from "react";

import {
  GET_LATEST_STATE,
  LOGIN,
  LOGIN_REJECTED,
  LOGOUT,
  TOGGLE_DARK_MODE,
  DEPOSIT_FUNDS,
  EDIT_TO_WATCHLIST,
  BUY_STOCK,
  SELL_STOCK,
  FOLLOW_USER,
  UNFOLLOW_USER,
} from "./actionTypes";
import { saveState, loadState } from "./localStorage";
const GC = React.createContext();

const user = loadState();

const stateResolver = (state, action) => {
  console.log({ wat: action.payload });
  const newState = { ...state, ...action.payload };
  saveState(newState);
  return newState;
};

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
      const logoutState = { ...state, loggedIn: false, userObj: {}, token: {} };
      saveState(logoutState);
      return logoutState;
    case TOGGLE_DARK_MODE:
      // Search: REVIEW tdm#01
      const mode = { ...state, ...action.payload };
      saveState(mode);
      return mode;
    case GET_LATEST_STATE:
    case DEPOSIT_FUNDS:
    case EDIT_TO_WATCHLIST:
    case BUY_STOCK:
    case SELL_STOCK:
    case FOLLOW_USER:
    case UNFOLLOW_USER:
      return stateResolver(state, action);
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

// ====== REVIEW tdm#01 ======
// ====== REVIEW tdm#01 ======
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
// ====== REVIEW tdm#01 ======
// ====== REVIEW tdm#01 ======
