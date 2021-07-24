import { sign } from 'jsonwebtoken'
import users from './model'
import { createErrMsg, verifyAndGetUserId, centsToDollars, dollarsToCents } from '../utils'

export const getUsers = async (req, res) => {
  try {
    const data = await users.find({}, { _id: 1, username: 1, name: 1, portfolio_private: 1 })
    res.json(data)
    // res.status(200).json({ data })
  } catch (err) {
    res.status(404).json(err.message)
  }
}

export const editUserWatchlist = async (req, res) => {
  try {
    const _id = verifyAndGetUserId(req, res)
    const { action, tickers } = req.body?.value

    // check if ticker exists
    // Review: ignore for now cuz im lazy to implement
    // if (!tickerIsLegit(ticker)) return res.status(400).json(createErrMsg({ message: 'Invalid Ticker' }))

    let updateRes

    if (action === 'update') {
      updateRes = await users.updateOne({ _id }, { $addToSet: { stock_watchlist: tickers } })
    }

    if (action === 'delete') {
      updateRes = await users.updateOne({ _id }, { $pullAll: { stock_watchlist: tickers } })
    }

    if (updateRes.nModified === 0) {
      res.status(400).json(createErrMsg({ message: 'Could not edit your watchlist' }))
    }

    if (updateRes.ok) {
      // funds to be in dollars but not
      res.json({ userObj: (await users.findOne({ _id }, { __v: 0, password: 0 })).toObject({ getters: true }) })
    } else {
      res.status(400).json(createErrMsg({ message: 'Could not deposit funds' }))
    }
  } catch ({ message }) {
    console.log(message)
  }
}

export const addUserFunds = async (req, res) => {
  try {
    const _id = verifyAndGetUserId(req, res)
    const userObj = await users.findOne({ _id }, { funds: 1 }).lean()
    const depositVal = +req.body?.value

    // check if deposit is correct format
    if (`${depositVal}`.split('.')[1]?.length > 2)
      return res.status(400).json(createErrMsg({ message: 'Amount should be no more than 2 decimals, e.g. $1.12' }))
    if (depositVal > 999900) return res.status(400).json(createErrMsg({ message: 'Max deposit is only $9999' }))

    const newAccBalance = dollarsToCents(depositVal) + userObj.funds

    // Note: careful with runValidators (https://mongoosejs.com/docs/validation.html#update-validators -> caveats with 'this' and 'context')
    const updateRes = await users.updateOne({ _id }, { $set: { funds: newAccBalance } }, { runValidators: true })

    if (updateRes.ok) {
      res.json({ userObj: (await users.findOne({ _id }, { __v: 0, password: 0 })).toObject({ getters: true }) })
    } else {
      res.status(400).json(createErrMsg({ message: 'Could not deposit funds' }))
    }
  } catch ({ message }) {
    console.log(message)
    res.status(400).json(createErrMsg({ message: 'Unexpected error, contact support' }))
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

    const userObj = existingUser.toObject({ getters: true })
    delete userObj.password

    const token = sign({ email: userObj.email, _id: userObj._id }, process.env.JWTSECRET, { expiresIn: '1d' })

    return res.status(201).json({
      userObj,
      token,
    })
  } catch ({ message }) {
    console.log('Login Err:' + message)
    res.status(500).json({ message })
  }
}
