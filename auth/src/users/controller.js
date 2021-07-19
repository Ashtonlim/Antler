import { sign } from 'jsonwebtoken'
import { createErrMsg } from '../utils'
import users from './model'

export const getUsers = async (req, res) => {
  try {
    const data = await users.find({}, { _id: 1, username: 1, name: 1, portfolio_private: 1 })
    res.json(data)
    // res.status(200).json({ data })
  } catch (err) {
    res.status(404).json(err.message)
  }
}

export const updateUserDetails = async (req, res) => {
  const { _id } = req.body

  // specified in middleware.js
  if (!req.userId) return res.json(createErrMsg({ message: 'Unauthenticated, Please logout and log back in' }))

  try {
    const userObj = await users.findOne({ id: _id }, { __v: 0, password: 0 })

    const depositVal = +req.body?.value
    const newAccBalance = depositVal + userObj.funds

    if (depositVal < 9999) {
      res.status(400).json(createErrMsg({ message: 'Max deposit is only $9999' }))
      return
    }

    // console.log('depositVal', depositVal, 'newAccBalance', newAccBalance)
    // console.log('userObj', userObj)
    const updateRes = await users.updateOne({ id: _id }, { $set: { funds: newAccBalance } })

    if (updateRes.ok) {
      userObj.funds = userObj.funds + depositVal
      res.json({ userObj })
    } else {
      res.status(400).json(createErrMsg({ message: 'Could not deposit funds' }))
    }
  } catch ({ message }) {
    res.status(400).json(createErrMsg({ message }))
  }
}

export const register = async (req, res) => {
  const body = req.body
  try {
    // createdAt: new Date().toISOString() // add this back if oid cant give timestamp
    const userObj = new users({ ...body, funds: 0 })
    userObj.setPassword(body.password)

    console.log('@controller.js: saving... ')
    // what happens to destructuring if await returns err obj?
    const { email, _id } = await userObj.save()
    const token = sign({ email, _id }, process.env.JWTSECRET, { expiresIn: '1d' })
    res.status(201).json({ userObj, token })
  } catch ({ message }) {
    console.log(message)
    res.status(409).json({ message })
  }
}

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

    const userObj = { ...existingUser.toObject() }
    delete userObj.password

    const token = sign({ email: userObj.email, _id: userObj._id }, process.env.JWTSECRET, { expiresIn: '1d' })

    return res.status(201).json({
      userObj,
      token,
    })
  } catch ({ message }) {
    console.log('existingUser123:' + message)
    res.status(500).json({ message })
  }
}
