import users from './model'
import fetch from 'node-fetch'

import { createErrMsg, verifyAndGetUserId, dollarsToCents } from '../utils'

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

      const purchaseCost = dollarsToCents(price.regularMarketPrice.raw * quantity * forex)
      // check if there is enuf funds for purchase
      if (userObj.funds < purchaseCost) return res.status(400).json(createErrMsg({ message: 'Purchase exceeds available funds' }))

      let upRes
      // why is there _id and id in stock_portfolio?
      if (tickerExists) {
        upRes = await users.updateOne(
          { _id, 'stock_portfolio.ticker': ticker },
          {
            $inc: {
              funds: -purchaseCost,
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
        upRes = await users.updateOne(
          { _id },
          {
            // $set: { funds: 100000, stock_portfolio: [] }, // uncomment to reset to empty portfolio
            $inc: { funds: -purchaseCost },
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

      // Review: or upRes.nModified? what's the diff between n and nModified
      if (upRes.acknowledged && upRes.modifiedCount > 0) {
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
    const _id = verifyAndGetUserId(req, res)
    const { ticker, quantity, forex } = req.body

    // Must buy at least 1 share
    if (quantity < 1) return res.status(400).json(createErrMsg({ message: 'At least 1 share must be sold.' }))

    // Ensure ticker exists and get price of stock
    const yhApiRes = await fetch(`https://query1.finance.yahoo.com/v10/finance/quoteSummary/${ticker}?modules=price`)

    if (yhApiRes.ok) {
      const {
        quoteSummary: {
          result: [{ price }],
        },
      } = await yhApiRes.json()

      let userObj = await users.findOne({ _id, 'stock_portfolio.ticker': ticker }).lean()
      if (userObj === null) {
        return res.status(400).json(createErrMsg({ message: 'Stock not owned' }))
      }

      if (isNaN(price.regularMarketPrice.raw) && isNaN(quantity) && isNaN(forex))
        return res.status(400).json(createErrMsg({ message: 'Issue with price, quantity or exchange rate' }))

      const orders = userObj.stock_portfolio.find((e) => e.ticker === ticker).stock_orders

      // check if there is enuf funds for purchase
      if (orders === undefined) return res.status(400).json(createErrMsg({ message: 'Could not find any orders for ticker?' }))

      // console.log(orders, orders.length)
      // console.log('===============')
      // console.log('===============')
      // console.log('===============')
      // print what's going on
      // for (let [toDeduct, i] = [quantity, 0]; toDeduct > 0 && orders.length > i; i++) {
      //   if (orders[i].quantity <= toDeduct) {
      //     console.log(`${toDeduct} After Removing[${i}]: `, orders[i])
      //     toDeduct -= orders[i].quantity
      //     orders.splice(i, 1)
      //   } else {
      //     // orders[i].quantity > toDeduct
      //     console.log(`${toDeduct} After Deducting[${i}]: `, orders[i])
      //     orders[i].quantity -= toDeduct
      //     orders[i].updates += 1
      //     toDeduct = 0
      //   }
      // }
      let toDeduct = quantity

      while (toDeduct > 0 && orders.length > 0) {
        if (orders[0].quantity <= toDeduct) {
          // console.log(`${toDeduct} After Removing: `, orders[0])
          toDeduct -= orders[0].quantity
          // orders.splice(0, 1)
          orders.shift()
        } else {
          // orders[0].quantity > toDeduct
          // console.log(`${toDeduct} After Deducting: `, orders[0])
          orders[0].quantity -= toDeduct
          orders[0].updates += 1
          toDeduct = 0
        }
      }

      // 'quantity - toDeduct' -> if could not sell all shares user request to sell (i.e. somehow user sent a req to sell more shares than he had),
      // quantity should be the actual # shares sold.
      // e.g. user req sell 10 shares, but user only has 7. toDeduct = 3 after above loop. quantity (10) - toDeduct (3) = 7
      const saleVal = dollarsToCents(price.regularMarketPrice.raw * (quantity - toDeduct) * forex)
      if (saleVal < 0) return res.status(400).json(createErrMsg({ message: 'Earnings is negative?' }))
      // console.log(orders, orders.length)

      let upRes
      console.log(orders)
      if (orders.length === 0) {
        // remove dict
        upRes = await users.updateOne(
          // based on the ticker specified for 'stock_portfolio.ticker', it knows to set 'stock_portfolio.$.stock_orders'
          { _id, 'stock_portfolio.ticker': ticker },
          // should it be pullAll if somehow > 1 obj with same ticker, tho should'nt be possible.
          { $inc: { funds: saleVal }, $pull: { stock_portfolio: { ticker } } },
          { runValidators: true }
        )
      } else {
        upRes = await users.updateOne(
          // based on the ticker specified for 'stock_portfolio.ticker', it knows to set 'stock_portfolio.$.stock_orders'
          { _id, 'stock_portfolio.ticker': ticker },
          { $inc: { funds: saleVal }, $set: { 'stock_portfolio.$.stock_orders': orders } },
          { runValidators: true }
        )
      }

      if (upRes.acknowledged && upRes.modifiedCount > 0) {
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
