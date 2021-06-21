import jwt from 'jsonwebtoken'

export const auth = async (req, res, next) => {
  try {
    if ('authorization' in req.headers) {
      const token = req.headers.authorization.split(' ')[1]
      console.log(token)
      console.log(req.headers)
    }
    console.log('token was not submitted')

    // let decodedData = jwt.verify(token, process.env.JWTSECRET)
    // const token = req.headers.authorization

    next()
  } catch (err) {
    console.log({ err, msg: err.message })
  }
}
