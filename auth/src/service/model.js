import mongoose from 'mongoose'
// import { Schema, model } from 'mongoose'
import { pbkdf2Sync } from 'crypto'

const userSchema = mongoose.Schema({
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
  funds: { type: Number, required: true, default: 0 },
  portfolio_private: { type: Boolean, required: true, default: true },
})

userSchema.methods = {
  setPassword(pwd) {
    this.password = pbkdf2Sync(pwd, this._id.toString(), 1000, 64, `sha512`).toString(`hex`)
  },
  authenticate(pwd) {
    return this.password === pbkdf2Sync(pwd, this._id.toString(), 1000, 64, `sha512`).toString(`hex`)
  },
}

export default mongoose.model('User', userSchema)
