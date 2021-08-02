import mongoose from 'mongoose'
import { pbkdf2Sync } from 'crypto'

import { centsToDollars } from '../utils'

const userFundsValidation = { validator: Number.isInteger, message: () => 'Erroneous deposit value, likely not an int' }

const stockOrders = mongoose.Schema(
  {
    // selling of stock requires stock_portfolio item(s) to be updated
    // e.g. I buy 3xAAPL and 5xAAPL. I sell 4x AAPL. My portfolio should now reflect 3xAAPL and 1xAAPL and
    // updates field for the original 5xAAPL should increment by 1
    updates: { type: Number, required: true, default: 1 },
    ticker: { type: String, required: true },
    order_price: { type: Number, required: true, min: 0.01, validate: userFundsValidation, get: centsToDollars },
    quantity: { type: Number, required: true, min: 1 },
  },
  { timestamps: true }
)

const userSchema = mongoose.Schema(
  {
    username: { type: String, required: true },
    name: { type: String, required: true },
    phone_num: { type: String, required: true },
    portfolio_private: { type: Boolean, required: true, default: true },
    email: {
      type: String,
      match: /^\S+@\S+\.\S+$/,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 3,
    },
    // Review: Unsure if correct to store funds in cents (avoids floating point issues)
    funds: {
      type: Number,
      min: 0,
      max: 999900,
      validate: userFundsValidation,
      get: centsToDollars,
      required: true,
      default: 0,
    },
    stock_watchlist: [
      {
        type: String,
        required: true,
        default: [],
        unique: true,
      },
    ],
    stock_portfolio: [
      {
        type: stockOrders,
        required: true,
        default: [],
      },
    ],
    // order_history: {
    //   type: ObjectId,
    //   required: true,
    //   default: [],
    //   unique: true,
    // },
  },
  { timestamps: true }
)

userSchema.methods = {
  setPassword(pwd) {
    this.password = pbkdf2Sync(pwd, this._id.toString(), 1000, 64, `sha512`).toString(`hex`)
  },

  authenticate(pwd) {
    return this.password === pbkdf2Sync(pwd, this._id.toString(), 1000, 64, `sha512`).toString(`hex`)
  },
}

export default mongoose.model('User', userSchema)
