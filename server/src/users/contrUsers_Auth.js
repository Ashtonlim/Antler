import users from './model'
import { sign } from 'jsonwebtoken'

// Review: might want to have a consts file?
const expiresIn = '5d'

export const login = async (req, res) => {
  const { username, password } = req.body

  try {
    // sent as {username: 'userInput'} and but may be email too hence search either email or username
    // NOTE: there must not be any usernames = emails of any and all users.
    // I.e. If user1 username = email of user 2 and they both happen to have the same pwd, user1 able to login to user2 account.
    const existingUser = await users.findOne({ $or: [{ email: username }, { username }] }, { __v: 0 })
    if (!existingUser || !existingUser.authenticate(password)) {
      return res.status(400).json({
        message: 'Wrong username/email or password',
      })
    }

    const userObj = existingUser.toObject({ getters: true })
    delete userObj.password

    const token = sign({ email: userObj.email, _id: userObj._id }, process.env.JWTSECRET, { expiresIn })

    return res.status(201).json({
      userObj,
      token,
    })
  } catch ({ message }) {
    console.log('Login Err:' + message)
    res.status(500).json({ message })
  }
}

export const register = async (req, res) => {
  const body = req.body
  try {
    // createdAt: new Date().toISOString() // add this back if oid cant give timestamp
    const userObj = new users({ ...body, funds: 100000 })
    userObj.setPassword(body.password)

    console.log('@controller.js: registering new user... ', userObj)
    // what happens to destructuring if await returns err obj?
    const { email, _id } = await userObj.save()
    const token = sign({ email, _id }, process.env.JWTSECRET, { expiresIn })
    res.status(201).json({ userObj: (await users.findOne({ _id }, { __v: 0, password: 0 })).toObject({ getters: true }), token })
  } catch ({ message }) {
    console.log(message)
    res.status(409).json({ message })
  }
}
