const { REACT_APP_BASE, REACT_APP_YF, REACT_APP_FX, REACT_APP_FX_API_KEY } =
  process.env

export const BASE = REACT_APP_BASE
export const YF = REACT_APP_YF
export const FX = REACT_APP_FX
export const FX_API_KEY = REACT_APP_FX_API_KEY
export const BASE_YF = `${BASE}/${YF}`
export const BASE_FX = `${BASE}/${FX}`

console.log(`from api const: ${BASE}, ${BASE_YF}, ${YF}`)
