import { useState, useEffect, useContext, useRef } from "react";

import GC from "context";
import { GET_LATEST_STATE } from "actionTypes";
import { api_getLatestState } from "api/user";

const useResetState = () => {
  const { dispatch } = useContext(GC);
  const [userState, setUserState] = useState(0);
  const ref = useRef(null);

  useEffect(() => {
    const resetUserState = async () => {
      if (ref.current !== null) return;
      try {
        ref.current = await api_getLatestState();
        setUserState(ref.current);
        dispatch({
          type: GET_LATEST_STATE,
          payload: ref.current,
        });
      } catch (err) {
        alert(err);
      }
    };
    resetUserState();
  }, [dispatch]);

  return { state: userState };
};

export default useResetState;
