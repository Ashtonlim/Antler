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
    console.log(body)
    const newUser = new users({ ...body, funds: 0 })
    newUser.setPassword(body.password)

    console.log('saving... ')
    // what happens to destructuring if await returns err obj?
    const { email, _id } = await newUser.save()
    const token = sign({ email, id: _id }, process.env.JWTSECRET, { expiresIn: '1h' })
    res.status(201).json({ newUser, token })
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
    const user = { ...existingUser.toObject() }
    const token = sign({ email: existingUser.email, id: existingUser._id }, process.env.JWTSECRET, { expiresIn: '1h' })

    delete user.password
    delete user.__v
    delete user._id // maybe can keep id?

    console.info('123', { ...user })
    return res.status(201).json({
      ...user,
      token,
    })
  } catch ({ message }) {
    console.log('existingUser123:' + message)
    res.status(500).json({ message })
  }
}
