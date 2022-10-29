import stocks from './model'
// import users from '../users/model'
import { verifyAndGetUserId } from '../utils'

export const getComments = async (req, res) => {
  try {
    const { ticker } = req.params
    res.json(await stocks.findOne({ ticker }))
  } catch (err) {
    res.status(404).json(err.message)
  }
}

export const postComment = async (req, res) => {
  try {
    const _id = verifyAndGetUserId(req, res)
    let { ticker, comments } = req.body
    comments = { ...comments, userID: _id }
    console.log(`@postComment: ${JSON.stringify(req.body)}, ${ticker}, ${comments}`)

    // check if ticker has any comments
    let existingStock = await stocks.findOne({ ticker }, { __v: 0 })
    console.log(`@postComment exi stock: ${existingStock}`)
    if (!existingStock) {
      existingStock = new stocks({ ticker, comments })
      return res.json(await existingStock.save())
    }
    // a = await stocks.updateOne({ ticker }, { $addToSet: { comments } }
    // console.log(`@postComment res: ${a}`)
    return res.json(await stocks.updateOne({ ticker }, { $addToSet: { comments } }))
  } catch ({ message }) {
    res.status(409).json({ message })
  }
}
