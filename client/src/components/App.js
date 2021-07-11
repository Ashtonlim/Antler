import React, { useEffect, useContext } from "react";
import { BrowserRouter } from "react-router-dom";

import Routes from "./Routes";
import GC from "context";
import { TOGGLE_DARK_MODE } from "actionTypes";

const App = () => {
  const { state, dispatch } = useContext(GC);

  useEffect(() => {
    const toggleLightMode = (darkMode = false) => {
      dispatch({ type: TOGGLE_DARK_MODE, payload: { darkMode } });
    };

    toggleLightMode(state.darkMode);
  }, []);

  return (
    <BrowserRouter>
      <Routes />
    </BrowserRouter>
  );
};

export default App;
