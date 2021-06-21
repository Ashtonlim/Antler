import { Router } from 'express'
// import mongoose from 'mongoose'
import { sign } from 'jsonwebtoken'

import users from './model'
// const router = Router()

export const getUsers = async (req, res) => {
  try {
    const data = await users.find({}, { _id: 1, username: 1, name: 1, portfolio_private: 1 })
    res.json(data)
    // res.status(200).json({ data })
  } catch (err) {
    res.status(404).json(err.message)
  }
}

export const register = async (req, res) => {
  const body = req.body
  try {
    // createdAt: new Date().toISOString() // add this back if oid cant give timestamp
    const newUser = new users({ ...body, funds: 0 })
    newUser.setPassword(body.password)

    console.log('@controller.js: saving... ')
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

  try {
    const existingUser = await users.findOne({ $or: [{ email: username }, { username }] }, { password: 0, __v: 0 })

    if (!existingUser) {
      return res.status(404).json({ message: 'User not found.' })
    }

    if (!existingUser.authenticate(password)) {
      return res.status(400).json({
        message: 'Wrong Password',
      })
    }

    const user = { ...existingUser.toObject() }
    const token = sign({ email: existingUser.email, id: existingUser._id }, process.env.JWTSECRET, { expiresIn: '1h' })

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
