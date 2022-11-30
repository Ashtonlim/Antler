import { createReqParams, resHandler } from './factory'
import { BASE } from './apiConsts'

export const api_GetPosts = async (id = '') => {
  return await resHandler(await fetch(`${BASE}/posts/${id}`, createReqParams()))
}

export const api_CreatePost = async (info) => {
  const res = await fetch(
    `${BASE}/posts/createPost`,
    createReqParams('POST', info)
  )
  return await resHandler(res)
}
