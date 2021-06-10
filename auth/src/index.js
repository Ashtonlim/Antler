import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
require('dotenv').config()

import userRoutes from './service/users'

const app = express()
const PORT = process.env.PORT || 8000

app.use(express.json())
// app.use(express.static('./routes'))
app.use(cors())

mongoose.set('useNewUrlParser', true)
mongoose.set('useFindAndModify', false)
mongoose.set('useCreateIndex', true)

app.use('/users', userRoutes)

mongoose
  .connect(process.env.MONGOAPIKEY, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() =>
    app.listen(PORT, () => {
      console.log(`listening at http://localhost:${PORT}`)
    })
  )
  .catch((err) => console.log(err))
