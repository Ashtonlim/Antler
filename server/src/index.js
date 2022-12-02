require('dotenv').config()
import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import swaggerUI from 'swagger-ui-express'
import { createProxyMiddleware } from 'http-proxy-middleware'

import swaggerJsDoc from './swagger'
import usersRoute from './users/users'
import postsRoute from './posts/posts'
import stocksRoute from './stocks/stocks'
import homeRoute from './home'

const app = express()
const PORT = process.env.PORT || 8000

app.use(express.json())
app.use(cors())
// app.get('/', (req, res) => {
//   res.send('Hello World!')
// })

app.get('/', (req, res) => {
  res.send(
    '<html> <head>server Response</head> <body><h1> This page was render direcly from the server <p>Hello there welcome to my website</p></h1></body></html>'
  )
})

app.use('/users', usersRoute)
app.use('/posts', postsRoute)
app.use('/stocks', stocksRoute)
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerJsDoc))

app.use('/api/v7', createProxyMiddleware({ target: 'https://free.currconv.com', changeOrigin: true }))
app.use('/yf', createProxyMiddleware({ target: 'https://query2.finance.yahoo.com', changeOrigin: true, pathRewrite: { '/yf': '/' } }))

const start = async () => {
  try {
    await mongoose.connect(process.env.MONGOAPIKEY)
    app.listen(PORT, () => {
      console.log(`listening at http://localhost:${PORT}/api-docs`)
    })
  } catch (err) {
    console.log(err)
  }
}

start()

// mongoose.set('useNewUrlParser', true)
// mongoose.set('useFindAndModify', false)
// mongoose.set('useCreateIndex', true)
// mongoose
//   .connect(process.env.MONGOAPIKEY, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//   })
//   .then(() =>
//     app.listen(PORT, () => {
//       console.log(`listening at http://localhost:${PORT}/api-docs`)
//     })
//   )
//   .catch((err) => console.log(err))
