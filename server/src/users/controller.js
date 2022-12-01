import users from './model'
import { createErrMsg, verifyAndGetUserId, dollarsToCents } from '../utils'

export const addUserFunds = async (req, res) => {
  try {
    const _id = verifyAndGetUserId(req, res)
    const depositVal = +req.body?.value

    // check if deposit is correct format, could convert to 2d.p. but it shouldn't be the case is > 2d.p. since frontend sends it as 2d.p.
    if (`${depositVal}`.split('.')[1]?.length > 2) return res.status(400).json(createErrMsg({ message: 'Specify deposit to the correct decimals' }))
    if (depositVal > 9999) return res.status(400).json(createErrMsg({ message: 'Max deposit is only $9999' }))

    // Note: careful with runValidators (https://mongoosejs.com/docs/validation.html#update-validators -> caveats with 'this' and 'context')
    const upRes = await users.updateOne({ _id }, { $inc: { funds: dollarsToCents(depositVal) } }, { runValidators: true })
    console.log(upRes)
    // modifiedCount only updates funds so === 1
    if (upRes.acknowledged && upRes.modifiedCount === 1) {
      res.json({ userObj: (await users.findOne({ _id }, { __v: 0, password: 0 })).toObject({ getters: true }) })
    } else {
      res.status(400).json(createErrMsg({ message: 'Could not deposit funds' }))
    }
  } catch ({ message }) {
    console.log(message)
    res.status(400).json(createErrMsg({ message: 'Unexpected error, contact support' }))
  }
}

export const editUserWatchlist = async (req, res) => {
  try {
    const _id = verifyAndGetUserId(req, res)
    const { action, ticker } = req.body?.val

    // check if ticker exists
    // Review: ignore for now cuz im lazy to implement
    // if (!tickerIsLegit(ticker)) return res.status(400).json(createErrMsg({ message: 'Invalid Ticker' }))

    let upRes

    // review: is it btr to split this into own api endpoint? check if following same person results in err
    if (action === 'add') upRes = await users.updateOne({ _id }, { $addToSet: { stock_watchlist: ticker } })
    if (action === 'del') upRes = await users.updateOne({ _id }, { $pull: { stock_watchlist: ticker } })

    // funds to be in dollars but not
    if (upRes.acknowledged && upRes.modifiedCount > 0) {
      res.json({ userObj: (await users.findOne({ _id }, { __v: 0, password: 0 })).toObject({ getters: true }) })
    } else {
      res.status(400).json(createErrMsg({ message: 'Could not edit your watchlist' }))
    }
  } catch ({ message }) {
    console.log(message)
  }
}

export const getUsers = async (req, res) => {
  try {
    res.json(await users.find({}, { _id: 1, username: 1, name: 1, portfolio_private: 1 }))
    // res.status(200).json({ data })
  } catch (err) {
    res.status(404).json(err.message)
  }
}

export const getUser = async (req, res) => {
  try {
    const { username } = req.params
    res.json(await users.findOne({ username }, { __v: 0, password: 0, email: 0, phone_num: 0, funds: 0, portfolio_private: 0 }))
  } catch (err) {
    res.status(404).json(err.message)
  }
}

export const getLatestUserState = async (req, res) => {
  try {
    const _id = verifyAndGetUserId(req, res)
    res.json({ userObj: (await users.findOne({ _id }, { __v: 0, password: 0 })).toObject({ getters: true }) })
  } catch (err) {
    res.status(404).json(err.message)
  }
}

// Review: possible to make follow and unfollow simpler?
export const follow = async (req, res) => {
  try {
    const _id = verifyAndGetUserId(req, res)
    const userIWantToFollow = req.body.userValue
    const { username } = await users.findOne({ _id })
    // checks if user exists
    console.log(userIWantToFollow, username)
    const IdIWantToFollow = (await users.findOne({ username: userIWantToFollow }))._id

    // Review: Should i check if I am alr following the person???

    // Either both updates must pass, or neither.
    // Should implement ACID transaction
    // 1. add to my following list
    // add to set ensures safe multiple times operation.
    const isFollowing = await users.updateOne({ _id }, { $addToSet: { following: userIWantToFollow } })
    if (isFollowing.acknowledged && isFollowing.modifiedCount > 0) {
      // 2. if works, add myself to follower's list of followed user
      let isFollowedBy = await users.updateOne({ _id: IdIWantToFollow }, { $addToSet: { followers: username } })
      let rollback
      let tries = 0
      // 3(failling). if fails, EITHER try again or rollback follow (try both and see which success).
      while ((!isFollowedBy.acknowledged || isFollowedBy.modifiedCount === 0) && tries < 10) {
        // 4. try again
        isFollowedBy = await users.updateOne({ _id: userIWantToFollow }, { $addToSet: { followers: username } })
        if (isFollowedBy.acknowledged && isFollowedBy.modifiedCount > 0) {
          // 5(passing). Report normal!
          return res.json({ userObj: (await users.findOne({ _id }, { __v: 0, password: 0 })).toObject({ getters: true }) })
        } else {
          // 5(failing). rollback, remove from my following list
          rollback = await users.updateOne({ _id }, { $pull: { following: userIWantToFollow } })
          if (rollback.acknowledged && rollback.modifiedCount > 0) {
            return res.status(400).json(createErrMsg({ message: 'Could not follow user' }))
          }
        }
        tries++
      }
      // 3(passing). Report normal!
      if (isFollowedBy.acknowledged && isFollowedBy.modifiedCount > 0) {
        res.json({ userObj: (await users.findOne({ _id }, { __v: 0, password: 0 })).toObject({ getters: true }) })
      } else {
        res.status(400).json(createErrMsg({ message: 'Could not follow user' }))
      }
    } else {
      res.status(400).json(createErrMsg({ message: 'Could not follow user' }))
    }
  } catch ({ message }) {
    res.status(400).json(createErrMsg({ message }))
  }
}

export const unfollow = async (req, res) => {
  try {
    const _id = verifyAndGetUserId(req, res)
    const userIWantToUnfollow = req.body.userValue
    const { username } = await users.findOne({ _id })
    // checks if user exists
    console.log(userIWantToUnfollow, username)
    const IdIWantToUnfollow = (await users.findOne({ username: userIWantToUnfollow }))._id

    // Review: Should i check if even following person???

    const isUnfollowed = await users.updateOne({ _id }, { $pull: { following: userIWantToUnfollow } })
    if (isUnfollowed.acknowledged && isUnfollowed.modifiedCount > 0) {
      let isUnfollowedBy = await users.updateOne({ _id: IdIWantToUnfollow }, { $pull: { followers: username } })
      let rollback
      let tries = 0
      while ((!isUnfollowedBy.acknowledged || isUnfollowedBy.modifiedCount === 0) && tries < 10) {
        isUnfollowedBy = await users.updateOne({ _id: IdIWantToUnfollow }, { $pull: { followers: username } })
        if (isUnfollowedBy.acknowledged && isUnfollowedBy.modifiedCount > 0) {
          return res.json({ userObj: (await users.findOne({ _id }, { __v: 0, password: 0 })).toObject({ getters: true }) })
        } else {
          rollback = await users.updateOne({ _id }, { $addToSet: { following: userIWantToUnfollow } })
          if (rollback.acknowledged && rollback.modifiedCount > 0) {
            return res.status(400).json(createErrMsg({ message: 'Could not follow user' }))
          }
        }
        tries++
      }

      if (isUnfollowedBy.acknowledged && isUnfollowedBy.modifiedCount > 0) {
        res.json({ userObj: (await users.findOne({ _id }, { __v: 0, password: 0 })).toObject({ getters: true }) })
      } else {
        res.status(400).json(createErrMsg({ message: 'Could not unfollow user' }))
      }
    }
  } catch ({ message }) {
    res.status(400).json(createErrMsg({ message }))
  }
}
