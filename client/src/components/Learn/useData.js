import { useState, useCallback, useRef, useContext } from "react";

import GC from "context";
import { GET_LATEST_STATE } from "actionTypes";
import { api_getLatestState } from "api/user";

const useData = (initVal) => {
  const { dispatch } = useContext(GC);
  const [URL, setURL] = useState(initVal);
  const ref = useRef(null);

  const start = useCallback(async () => {
    if (ref.current !== null) return;
    console.log("once only at least");
    try {
      ref.current = await api_getLatestState();
      setURL((c) => ref.current);
      dispatch({
        type: GET_LATEST_STATE,
        payload: ref.current,
      });
    } catch (err) {
      alert(err);
    }
  }, [dispatch]);

  //   const start = useCallback(() => {
  //     if (ref.current !== null) return;
  //     ref.current = setInterval(() => {
  //       setURL((c) => c + 1);
  //     }, 500);
  //   }, []);

  const stop = useCallback(() => {
    if (ref.current === null) return;
    clearInterval(ref.current);
    ref.current = null;
  }, []);

  const reset = useCallback(() => {
    setURL(0);
  }, []);

  console.log("runnn");
  return { URL, start, stop, reset };
};
export default useData;
