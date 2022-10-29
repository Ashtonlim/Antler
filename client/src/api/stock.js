import { createReqParams, resHandler } from './factory'
import { BASE } from './apiConsts'

export const api_GetStockComment = async (ticker = '') => {
  return await resHandler(
    await fetch(`${BASE}/stocks/comment/${ticker}`, createReqParams())
  )
}

export const api_PostComment = async (info) => {
  const res = await fetch(
    `${BASE}/stocks/comment`,
    createReqParams('POST', info)
  )
  return await resHandler(res)
}
