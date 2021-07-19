import { loadState } from "localStorage";
import { createReqParams, resHandler } from "./factory";
import { BASE } from "./const";

export const getUsers = async (id = null) => {
  return await resHandler(await fetch(`${BASE}/users${id ? "/" + id : ""}`));
};

export const registerUser = async (regDetails) => {
  console.log("regDetails", regDetails);
  const res = await fetch(`${BASE}/users`, createReqParams("POST", regDetails));
  return await resHandler(res);
};

export const loginUser = async (loginDetails) => {
  const res = await fetch(
    `${BASE}/users/login`,
    createReqParams("POST", loginDetails)
  );

  return await resHandler(res);
};

export const api_addFunds = async (info) => {
  const res = await fetch(
    `${BASE}/users/addfunds`,
    createReqParams("POST", info)
  );
  return await resHandler(res);
};

export const editUser = async (userDetails) => {
  const userData = loadState();

  const res = await fetch(
    `${BASE}/users/${userData.id}`,
    createReqParams("PUT", userDetails)
  );
  return await resHandler(res);
};

export const editPass = async (passDetails) => {
  const res = await fetch(
    `${BASE}/users/reset_password`,
    createReqParams("PUT", passDetails)
  );
  return await resHandler(res);
};
