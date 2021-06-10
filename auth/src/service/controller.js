import { Router } from 'express'
import mongoose from 'mongoose'
import { sign } from 'jsonwebtoken'

import users from './model'
const router = Router()

export const getUsers = async (req, res) => {
  const { page } = req.query
  console.log(page)
  try {
    const LIMIT = 10
    const startIndex = (Number(page) - 1) * LIMIT
    const total = await users.countDocuments({})
    const data = await users.find()
    // console.log(data)
    res.json(data)
    // res.status(200).json({ data })
  } catch (err) {
    res.status(404).json(err.message)
  }
}

export const register = async (req, res) => {
  const body = req.body
  try {
    // , createdAt: new Date().toISOString() // add this back if oid cant give timestamp
    // {
    //     "email": "ash@gmail.com",
    //     "username": "ash",
    //     "password": "pass",
    //     "name": "ashy",
    //     "hp": "+65111"
    //   }
    const userObj = new users({ ...body, funds: 0 })
    userObj.setPassword(body.password)

    console.log('saving... ')
    // what happens to destructuring if await returns err obj?
    const { email, _id } = await userObj.save()
    const token = sign({ email, id: _id }, process.env.JWTSECRET, { expiresIn: '1h' })
    res.status(201).json({ userObj, token })
  } catch ({ message }) {
    console.log(message)
    res.status(409).json({ message })
  }
}

export const login = async (req, res) => {
  const { username, password } = req.body
  console.log(username, password)

  try {
    const existingUser = await users.findOne({ $or: [{ email: username }, { username }] })

    if (!existingUser) {
      return res.status(404).json({ message: 'User not found.' })
    }

    if (!existingUser.authenticate(password)) {
      return res.status(400).json({
        message: 'Wrong Password',
      })
    }

    //
    const userObj = { ...existingUser.toObject() }
    const token = sign({ email: userObj.email, id: userObj._id }, process.env.JWTSECRET, { expiresIn: '1h' })

    delete userObj.password
    delete userObj.__v
    delete userObj._id // maybe can keep id?

    console.info('123', { ...userObj })
    return res.status(201).json({
      userObj,
      token,
    })
  } catch ({ message }) {
    console.log('existingUser123:' + message)
    res.status(500).json({ message })
  }
}
