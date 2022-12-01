import posts from './model'
import users from '../users/model'
import fetch from 'node-fetch'

import { createErrMsg, verifyAndGetUserId } from '../utils'

export const getPosts = async (req, res) => {
  try {
    const id = req.params.ticker
    if (id.length > 10) {
      res.json(await posts.find({ userID: id }))
    } else {
      res.json(await posts.find({ ticker: id.toUpperCase() }))
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

    // check if ticker exists
    const yhApiRes = await fetch(`https://query2.finance.yahoo.com/v10/finance/quoteSummary/${ticker}?modules=price`)

    if (yhApiRes.ok) {
      postData = { ...postData, userID: _id }
      console.log(`@posts.controler: ${JSON.stringify(req.body)}, ${JSON.stringify(postData, ticker)}}, ${postData}`)

      const Post = new posts(postData)
      const savedPost = await Post.save()
      console.log(`savedPost: ${savedPost}`)

      const userDetails = await users.updateOne({ _id }, { $set: { postCount: await posts.count({ userID: _id }) } })
      console.log(`userDetails: ${userDetails}`)
      // check if ticker has comments
      // let existingStock = await posts.findOne({ ticker }, { __v: 0 })
      // console.log(`@posts.controler: existingStock: ${existingStock}`)

      // if (existingStock === null) {
      //   existingStock = new posts({ ticker, comments })
      //   await existingStock.save()
      // }
      return res.json({ userObj: (await users.findOne({ _id }, { __v: 0, password: 0 })).toObject({ getters: true }) })
    }

    return res.status(400).json(createErrMsg({ message: 'No such Ticker symbol' }))

    // a = await posts.updateOne({ ticker }, { $addToSet: { comments } }
    // console.log(`@postComment res: ${a}`)
  } catch ({ message }) {
    console.log(message)
    res.status(409).json({ message })
  }
}
