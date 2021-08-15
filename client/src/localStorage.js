const INITIAL_STATE = { loggedIn: false, userObj: {}, darkMode: false };

export const loadState = (key = "state") => {
  try {
    const serializedState = window.localStorage.getItem(key);
    if (serializedState) {
      return JSON.parse(serializedState);
    }
    return INITIAL_STATE;
  } catch (err) {
    console.log(err);
    return INITIAL_STATE;
  }
};

export const saveState = (state, key = "state") => {
  console.log("savingState");
  try {
    window.localStorage.setItem(key, JSON.stringify(state));
  } catch (err) {
    console.log(err);
  }
};
