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
    const updateRes = await users.updateOne({ _id }, { $inc: { funds: dollarsToCents(depositVal) } }, { runValidators: true })

    // nModified only updates funds so === 1
    if (updateRes.ok && updateRes.nModified === 1) {
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
    const { action, tickers } = req.body?.value

    // check if ticker exists
    // Review: ignore for now cuz im lazy to implement
    // if (!tickerIsLegit(ticker)) return res.status(400).json(createErrMsg({ message: 'Invalid Ticker' }))

    let updateRes

    // review: is it btr to split this into own api endpoint? check if following same person results in err
    if (action === 'update') updateRes = await users.updateOne({ _id }, { $addToSet: { stock_watchlist: tickers } })
    if (action === 'delete') updateRes = await users.updateOne({ _id }, { $pull: { stock_watchlist: tickers } })

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

export const getUsers = async (req, res) => {
  try {
    res.json(await users.find({}, { _id: 1, username: 1, name: 1, portfolio_private: 1 }))
    // res.status(200).json({ data })
  } catch (err) {
    res.status(404).json(err.message)
  }
}

export const getUser = async (req, res) => {
  const { username } = req.params
  try {
    const user = await users.findOne({ username }, { __v: 0, password: 0, email: 0, phone_num: 0, funds: 0, portfolio_private: 0 })
    res.json(user)
  } catch (err) {
    res.status(404).json(err.message)
  }
}

// Review: possible to make follow and unfollow simpler?
export const follow = async (req, res) => {
  try {
    const _id = verifyAndGetUserId(req, res)
    const { username } = req.body

    // Either both updates must pass, or neither.
    // 1. add to my following list
    const isFollowing = await users.updateOne({ _id }, { $addToSet: { following: username } })
    if (isFollowing.ok && isFollowing.nModified > 0) {
      // 2. if works, add myself to follower's list of followed user
      let isFollowedBy = await users.updateOne({ username }, { $addToSet: { followers: username } })
      let rollback
      let tries = 0
      // 3(failling). if fails, either try again or rollback follow.
      while ((!isFollowedBy.ok || isFollowedBy.nModified === 0) && tries < 10) {
        // 4. try again
        isFollowedBy = await users.updateOne({ username }, { $addToSet: { followers: username } })
        if (isFollowedBy.ok && isFollowedBy.nModified > 0) {
          // 5(passing). Report normal!
          return res.json({ userObj: (await users.findOne({ _id }, { __v: 0, password: 0 })).toObject({ getters: true }) })
        } else {
          // 5(failing). rollback, remove from my following list
          rollback = await users.updateOne({ _id }, { $addToSet: { following: username } })
          if (rollback.ok && rollback.nModified > 0) {
            return res.status(400).json(createErrMsg({ message: 'Could not follow user' }))
          }
        }
        tries++
      }
      // 3(passing). Report normal!
      if (isFollowedBy.ok && isFollowedBy.nModified > 0) {
        res.json({ userObj: (await users.findOne({ _id }, { __v: 0, password: 0 })).toObject({ getters: true }) })
      } else {
        res.status(400).json(createErrMsg({ message: 'Could not follow user' }))
      }
    } else {
      res.status(400).json(createErrMsg({ message: 'Could not follow user' }))
    }
  } catch (err) {
    res.status(404).json(err.message)
  }
}

export const unfollow = async (req, res) => {
  try {
    const _id = verifyAndGetUserId(req, res)
    const { username } = req.body

    const isunfollowed = await users.updateOne({ _id }, { $pull: { following: username } })
    if (isunfollowed.ok && isunfollowed.nModified > 0) {
      let isUnfollowedBy = await users.updateOne({ username }, { $pull: { followers: username } })
      let rollback
      let tries = 0
      while ((!isUnfollowedBy.ok || isUnfollowedBy.nModified === 0) && tries < 10) {
        isUnfollowedBy = await users.updateOne({ username }, { $pull: { followers: username } })
        if (isUnfollowedBy.ok && isUnfollowedBy.nModified > 0) {
          return res.json({ userObj: (await users.findOne({ _id }, { __v: 0, password: 0 })).toObject({ getters: true }) })
        } else {
          rollback = await users.updateOne({ _id }, { $pull: { following: username } })
          if (rollback.ok && rollback.nModified > 0) {
            return res.status(400).json(createErrMsg({ message: 'Could not follow user' }))
          }
        }
        tries++
      }

      if (isUnfollowedBy.ok && isUnfollowedBy.nModified > 0) {
        res.json({ userObj: (await users.findOne({ _id }, { __v: 0, password: 0 })).toObject({ getters: true }) })
      } else {
        res.status(400).json(createErrMsg({ message: 'Could not unfollow user' }))
      }
    }
  } catch (err) {
    res.status(404).json(err.message)
  }
}
