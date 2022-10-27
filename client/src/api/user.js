import { createReqParams, resHandler } from './factory'
import { BASE } from './apiConsts'

export const getUsers = async (id = null) => {
  return await resHandler(await fetch(`${BASE}/users${id ? '/' + id : ''}`))
}

export const api_getLatestState = async () => {
  return await resHandler(
    await fetch(`${BASE}/users/latest/state`, createReqParams())
  )
}

export const registerUser = async (regDetails) => {
  console.log('regDetails', regDetails)
  const res = await fetch(
    `${BASE}/users/reg`,
    createReqParams('POST', regDetails)
  )
  return await resHandler(res)
}

export const loginUser = async (loginDetails) => {
  console.log(`${BASE}/users/login`, BASE)
  const res = await fetch(
    `${BASE}/users/login`,
    createReqParams('POST', loginDetails)
  )

  return await resHandler(res)
}

export const api_followUser = async (info) => {
  const res = await fetch(`${BASE}/users/follow`, createReqParams('POST', info))
  return await resHandler(res)
}

export const api_unfollowUser = async (info) => {
  const res = await fetch(
    `${BASE}/users/unfollow`,
    createReqParams('POST', info)
  )
  return await resHandler(res)
}

export const api_addFunds = async (info) => {
  const res = await fetch(
    `${BASE}/users/addfunds`,
    createReqParams('POST', info)
  )
  return await resHandler(res)
}

export const api_editWatchlist = async (info) => {
  const res = await fetch(
    `${BASE}/users/editwatchlist`,
    createReqParams('POST', info)
  )
  return await resHandler(res)
}

export const api_buyStock = async (info) => {
  const res = await fetch(
    `${BASE}/users/buystock`,
    createReqParams('POST', info)
  )
  return await resHandler(res)
}

export const api_sellStock = async (info) => {
  const res = await fetch(
    `${BASE}/users/sellstock`,
    createReqParams('POST', info)
  )
  return await resHandler(res)
}

// export const editUser = async (userDetails) => {
//   const userData = loadState();
//   const res = await fetch(
//     `${BASE}/users/${userData.id}`,
//     createReqParams("PUT", userDetails)
//   );
//   return await resHandler(res);
// };

// export const editPass = async (passDetails) => {
//   const res = await fetch(
//     `${BASE}/users/reset_password`,
//     createReqParams("PUT", passDetails)
//   );
//   return await resHandler(res);
// };
