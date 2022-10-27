import { resHandler } from './factory'
import { BASE_FX, FX_API_KEY } from './apiConsts'

export const currConv = async ({ from = 'USD', to = 'SGD' } = {}) => {
  const api = `${BASE_FX}/convert?q=${from}_${to}&compact=ultra&apiKey=${FX_API_KEY}`
  return await resHandler(await fetch(api))
}
