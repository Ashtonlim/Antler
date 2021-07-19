import jwt from 'jsonwebtoken'
import { createErrMsg } from '../utils'

// implemented according to -> https://youtu.be/LKlO8vLvUao?t=6286
export const auth = async (req, res, next) => {
  // console.log('users/middleware,js', req.headers.authorization)
  try {
    if ('authorization' in req.headers) {
      // split by ' ' bc headers comes as 'bearer [jwt_token]' -> https://swagger.io/docs/specification/authentication/bearer-authentication/
      const token = req.headers.authorization.split(' ')[1]
      let decodedData = jwt.verify(token, process.env.JWTSECRET)
      req.userId = decodedData?._id
      // decodedData is = to what is passed into sign() in controller.js
      // console.log(decodedData)
    }

    next()
  } catch (err) {
    console.log(err)
    res.status(404).json(createErrMsg({ message: `${err.message} - relogin to fix, (msg from users/middleware.js)` }))
  }
}
