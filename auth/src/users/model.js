import mongoose from 'mongoose'
import { pbkdf2Sync } from 'crypto'

import { centsToDollars } from '../utils'

const userFundsValidation = { validator: Number.isInteger, message: () => 'Erroneous deposit value, likely not an int' }

const stockPurchase = mongoose.Schema(
  {
    company: { type: String },
    ticker: { type: String },
    purchase_price: { type: Number },
    quantity: { type: Number, min: 1 },
  },
  { timestamps: true }
)

const userSchema = mongoose.Schema(
  {
    email: {
      type: String,
      match: /^\S+@\S+\.\S+$/,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    username: { type: String, required: true },
    password: {
      type: String,
      required: true,
      minlength: 3,
    },
    name: { type: String, required: true },
    phone_num: { type: String, required: true },
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
    portfolio_private: { type: Boolean, required: true, default: true },
    stock_watchlist: {
      type: [String],
      required: true,
      default: [],
      unique: true,
    },
    stock_portfolio: [
      {
        type: stockPurchase,
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
