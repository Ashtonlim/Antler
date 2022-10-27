import { createReqParams, resHandler } from './factory'
import { BASE_YF } from './apiConsts'

export const getUsers = async (id = null) => {
  return await resHandler(await fetch(`${BASE_YF}/users${id ? '/' + id : ''}`))
}

export const api_getLatestState = async () => {
  return await resHandler(
    await fetch(`${BASE_YF}/users/latest/state`, createReqParams())
  )
}

export const registerUser = async (regDetails) => {
  console.log('regDetails', regDetails)
  const res = await fetch(
    `${BASE_YF}/users/reg`,
    createReqParams('POST', regDetails)
  )
  return await resHandler(res)
}

export const loginUser = async (loginDetails) => {
  console.log(`${BASE_YF}/users/login`, BASE_YF)
  const res = await fetch(
    `${BASE_YF}/users/login`,
    createReqParams('POST', loginDetails)
  )

  return await resHandler(res)
}

export const api_followUser = async (info) => {
  const res = await fetch(
    `${BASE_YF}/users/follow`,
    createReqParams('POST', info)
  )
  return await resHandler(res)
}

export const api_unfollowUser = async (info) => {
  const res = await fetch(
    `${BASE_YF}/users/unfollow`,
    createReqParams('POST', info)
  )
  return await resHandler(res)
}

export const api_addFunds = async (info) => {
  const res = await fetch(
    `${BASE_YF}/users/addfunds`,
    createReqParams('POST', info)
  )
  return await resHandler(res)
}

export const api_editWatchlist = async (info) => {
  const res = await fetch(
    `${BASE_YF}/users/editwatchlist`,
    createReqParams('POST', info)
  )
  return await resHandler(res)
}

export const api_buyStock = async (info) => {
  const res = await fetch(
    `${BASE_YF}/users/buystock`,
    createReqParams('POST', info)
  )
  return await resHandler(res)
}

export const api_sellStock = async (info) => {
  const res = await fetch(
    `${BASE_YF}/users/sellstock`,
    createReqParams('POST', info)
  )
  return await resHandler(res)
}

// export const editUser = async (userDetails) => {
//   const userData = loadState();
//   const res = await fetch(
//     `${BASE_YF}/users/${userData.id}`,
//     createReqParams("PUT", userDetails)
//   );
//   return await resHandler(res);
// };

// export const editPass = async (passDetails) => {
//   const res = await fetch(
//     `${BASE_YF}/users/reset_password`,
//     createReqParams("PUT", passDetails)
//   );
//   return await resHandler(res);
// };
