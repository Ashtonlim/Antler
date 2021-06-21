require('dotenv').config()
import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import swaggerUI from 'swagger-ui-express'
import swaggerJsDoc from './swagger.json'

import userRoutes from './service/users'

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

app.use(express.json())
app.use(cors())
app.use('/users', userRoutes)
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerJsDoc))


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
