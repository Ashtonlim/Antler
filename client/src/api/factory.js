import { loadState } from 'localStorage'

export const createHeaders = (args) => ({
  Accept: 'application/json',
  'Content-Type': 'application/json',
  ...args,
})

// Client should be responsible for what's sent to backend.
// Ideally, backend should be able to understand what to do based on info sent.
export const createReqParams = (method = 'GET', body, headers = 'json') => {
  const params = {}
  if (method) params['method'] = method.toUpperCase()
  if (body) params['body'] = JSON.stringify(body)

  if (headers === 'json') {
    let addToHeaders = {}

    const state = loadState()
    // why have 'Bearer' at the start? https://swagger.io/docs/specification/authentication/bearer-authentication/
    // ResearchMore.
    const Authorization = `Bearer ${state.token}`

    if (Authorization !== undefined) {
      addToHeaders = { ...addToHeaders, Authorization }
    }
    params['headers'] = createHeaders(addToHeaders)
    // console.log({ log: "factory.js", params, token: Authorization });
  }

  return params
}

export const resHandler = async (res) => {
  try {
    // console.log(res)
    if (res.ok) {
      return await res.json()

      // const { message: val, ...resObj } = await res.json();
      // if no msg provided, val is undefined
      // console.log("@factory.js: res from server is okay :)", val, resObj);

      // const x = await res.json();
      // console.log({ x });
      // return x;
    }

    console.log('@factory.js: res from server is not okay :(')
    const jsonResErr = await res.json()
    if (jsonResErr instanceof Object) {
      if ('message' in jsonResErr) {
        console.log(jsonResErr.message)
        throw new Error(jsonResErr.message)
      }
    }

    return await jsonResErr
  } catch (err) {
    console.log(err)
    return err
  }
}

export const noCSFR = { ok: false, err: 'no csfr token' }
