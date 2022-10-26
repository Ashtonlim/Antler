require('dotenv').config()
import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import swaggerUI from 'swagger-ui-express'
import { createProxyMiddleware } from 'http-proxy-middleware'

import swaggerJsDoc from './swagger'
import usersRoute from './users/users'
import stocksRoute from './stocks/stocks'

const app = express()
const PORT = process.env.PORT || 8000

// app.use(express.static('./routes'))

// Add a list of allowed origins.
// If you have more origins you would like to add, you can add them to the array below.
// const allowedOrigins = ['http://localhost:3000']

// app.use(
//   cors({
//     origin: allowedOrigins,
//   })
// )

const Pub = './public'
// app.get('/public', function (req, res) {
//   res.sendFile(path.join(Pub, 'index.html'))
// })

let options = {}
app.use(express.static('public'))

app.use(express.json())
app.use(cors())

app.use('/users', usersRoute)
app.use('/stocks', stocksRoute)
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerJsDoc))
app.use('/api/v7', createProxyMiddleware({ target: 'https://free.currconv.com', changeOrigin: true }))
app.use('/', createProxyMiddleware({ target: 'https://query1.finance.yahoo.com', changeOrigin: true }))

mongoose.set('useNewUrlParser', true)
mongoose.set('useFindAndModify', false)
mongoose.set('useCreateIndex', true)
mongoose
  .connect(process.env.MONGOAPIKEY, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() =>
    app.listen(PORT, () => {
      console.log(`listening at http://localhost:${PORT}/api-docs`)
    })
  )
  .catch((err) => console.log(err))