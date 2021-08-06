import users from './model'
import fetch from 'node-fetch'
import { sign } from 'jsonwebtoken'

import { createErrMsg, verifyAndGetUserId, dollarsToCents } from '../utils'

const expiresIn = '5d'

export const addUserFunds = async (req, res) => {
  try {
    const _id = verifyAndGetUserId(req, res)
    const userObj = await users.findOne({ _id }, { funds: 1 }).lean()
    const depositVal = +req.body?.value

    // check if deposit is correct format, could convert to 2d.p. but it shouldn't be the case is > 2d.p. since frontend sends it as 2d.p.
    if (`${depositVal}`.split('.')[1]?.length > 2) return res.status(400).json(createErrMsg({ message: 'Specify deposit to the correct decimals' }))
    if (depositVal > 999900) return res.status(400).json(createErrMsg({ message: 'Max deposit is only $9999' }))

    const newAccBalance = dollarsToCents(depositVal) + userObj.funds

    // Note: careful with runValidators (https://mongoosejs.com/docs/validation.html#update-validators -> caveats with 'this' and 'context')
    const updateRes = await users.updateOne({ _id }, { $set: { funds: newAccBalance } }, { runValidators: true })

    if (updateRes.ok && updateRes.nModified > 0) {
      res.json({ userObj: (await users.findOne({ _id }, { __v: 0, password: 0 })).toObject({ getters: true }) })
    } else {
      res.status(400).json(createErrMsg({ message: 'Could not deposit funds' }))
    }
  } catch ({ message }) {
    console.log(message)
    res.status(400).json(createErrMsg({ message: 'Unexpected error, contact support' }))
  }
}

export const buyStock = async (req, res) => {
  try {
    const _id = verifyAndGetUserId(req, res)
    const { ticker, quantity, unitCost, totalCost, forex } = req.body

    // Must buy at least 1 share
    if (quantity < 1) return res.status(400).json(createErrMsg({ message: 'At least 1 share must be bought' }))

    // Ensure ticker exists and get price of stock
    const yhApiRes = await fetch(`https://query1.finance.yahoo.com/v10/finance/quoteSummary/${ticker}?modules=price`)

    if (yhApiRes.ok) {
      const {
        quoteSummary: {
          result: [{ price }],
        },
      } = await yhApiRes.json()

      if (price.regularMarketPrice.raw !== unitCost)
        // Review: should get forex price but will use what user sent for now
        console.log(
          `deviation from user expected price execution. User saw [Share: ${unitCost}, forex: ${forex}], server saw [Share: ${
            price.regularMarketPrice.raw
          }, forex: ${forex}]. Diff: ${price.regularMarketPrice.raw - unitCost}`
        )

      // const userObj = await users.findOne({ _id }, { funds: 1 }).lean()
      let tickerExists = true
      let userObj = await users.findOne({ _id, 'stock_portfolio.ticker': ticker }).lean()
      // console.log({ tickerExists, userObj }, userObj === null)
      if (userObj === null) {
        tickerExists = false
        userObj = await users.findOne({ _id }).lean()
      }

      if (isNaN(price.regularMarketPrice.raw) && isNaN(quantity) && isNaN(forex))
        return res.status(400).json(createErrMsg({ message: 'Issue with price, quantity or exchange rate' }))

      const purchaseCost = dollarsToCents(-(price.regularMarketPrice.raw * quantity * forex))
      // check if there is enuf funds for purchase
      if (userObj.funds < purchaseCost) return res.status(400).json(createErrMsg({ message: 'Purchase exceeds available funds' }))
      const newAccBalance = purchaseCost + userObj.funds
      // console.log(price.regularMarketPrice.raw, { purchaseCost, newAccBalance, quantity, forex, funds: userObj.funds, _id })

      let updateRes
      // why is there _id and id in stock_portfolio?
      if (tickerExists) {
        updateRes = await users.updateOne(
          { _id, 'stock_portfolio.ticker': ticker },
          {
            $set: {
              funds: newAccBalance,
              // stock_portfolio: [], // uncomment to reset to empty portfolio
            },
            $push: {
              'stock_portfolio.$.stock_orders': {
                order_price: dollarsToCents(price.regularMarketPrice.raw),
                quantity,
                // Review: Pushing this way does not auto insert createdAt and updatedAt, therefore added here. How to have it automatically?
                createdAt: new Date(),
                updatedAt: new Date(),
              },
            },
          },
          { runValidators: true }
        )
      } else {
        updateRes = await users.updateOne(
          { _id },
          {
            // $set: { funds: 100000, stock_portfolio: [] }, // uncomment to reset to empty portfolio
            $set: {
              funds: newAccBalance,
            },
            $push: {
              stock_portfolio: {
                ticker,
                stock_orders: {
                  order_price: dollarsToCents(price.regularMarketPrice.raw),
                  quantity,
                  createdAt: new Date(),
                  updatedAt: new Date(),
                },
              },
            },
          },
          { runValidators: true }
        )
      }

      // Review: or updateRes.nModified? what's the diff between n and nModified
      if (updateRes.ok && updateRes.n > 0) {
        res.json({ userObj: (await users.findOne({ _id }, { __v: 0, password: 0 })).toObject({ getters: true }) })
      } else {
        res.status(400).json(createErrMsg({ message: 'Could not deposit funds' }))
      }
    }
  } catch ({ message }) {
    console.log({ message })
    res.status(400).json(createErrMsg({ message: 'Unexpected error, contact support' }))
  }
}
export const sellStock = async (req, res) => {
  try {
    console.log('selling stock')
  } catch ({ message }) {
    console.log({ message })
    res.status(400).json(createErrMsg({ message: 'Unexpected error, contact support' }))
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

    if (action === 'update') updateRes = await users.updateOne({ _id }, { $addToSet: { stock_watchlist: tickers } })
    if (action === 'delete') updateRes = await users.updateOne({ _id }, { $pullAll: { stock_watchlist: tickers } })

    // funds to be in dollars but not
    if (updateRes.ok && updateRes.nModified > 0) {
      res.json({ userObj: (await users.findOne({ _id }, { __v: 0, password: 0 })).toObject({ getters: true }) })
    } else {
      res.status(400).json(createErrMsg({ message: 'Could not edit your watchlist' }))
    }
  } catch ({ message }) {
    console.log(message)
  }
}

export const register = async (req, res) => {
  const body = req.body
  try {
    // createdAt: new Date().toISOString() // add this back if oid cant give timestamp
    const userObj = new users({ ...body, funds: 0 })
    userObj.setPassword(body.password)

    console.log('@controller.js: saving... ', userObj)
    // what happens to destructuring if await returns err obj?
    const { email, _id } = await userObj.save()
    const token = sign({ email, _id }, process.env.JWTSECRET, { expiresIn })
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

export const getUsers = async (req, res) => {
  try {
    const data = await users.find({}, { _id: 1, username: 1, name: 1, portfolio_private: 1 })
    res.json(data)
    // res.status(200).json({ data })
  } catch (err) {
    res.status(404).json(err.message)
  }
}
