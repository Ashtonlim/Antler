import posts from './model'
import users from '../users/model'
import fetch from 'node-fetch'

import { createErrMsg, verifyAndGetUserId } from '../utils'

export const getPosts = async (req, res) => {
  try {
    const id = req.params.ticker
    console.log(id)
    if (id.length > 10) {
      res.json(await posts.find({ userID: id }))
    } else {
      res.json(await posts.find({ Ticker: id.toUpperCase() }))
    }
  } catch (err) {
    res.status(404).json(err.message)
  }
}

export const createPost = async (req, res) => {
  try {
    const _id = verifyAndGetUserId(req, res)

    let postData = req.body
    const { ticker } = postData
    const comments = {}

    postData = { ...postData, userID: _id }
    console.log(`@postComment: ${JSON.stringify(req.body)}, ${JSON.stringify(postData, ticker)}}, ${postData}`)

    // check if ticker exists
    const yhApiRes = await fetch(`https://query2.finance.yahoo.com/v10/finance/quoteSummary/${ticker}?modules=price`)

    if (yhApiRes.ok) {
      // check if ticker has comments
      const Post = new posts(postData)
      const { _id } = await Post.save()

      let existingStock = await posts.findOne({ ticker }, { __v: 0 })
      console.log(`@postComment exi stock: ${existingStock}`)

      if (existingStock === null) {
        existingStock = new posts({ ticker, comments })
        return res.json(await existingStock.save())
      }

      res.json(await users.updateOne({ _id }, { $inc: { postCount: 1 } }))
      return
      // const upRes = await users.updateOne({ _id }, { $inc: { funds: dollarsToCents(depositVal) } }, { runValidators: true })
    }
    return res.status(400).json(createErrMsg({ message: 'Could not unfollow user' }))

    // a = await posts.updateOne({ ticker }, { $addToSet: { comments } }
    // console.log(`@postComment res: ${a}`)
  } catch ({ message }) {
    console.log(message)
    res.status(409).json({ message })
  }
}
