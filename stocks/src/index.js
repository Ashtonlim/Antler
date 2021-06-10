import express from 'express'
import cors from 'cors'
require('dotenv').config()

const app = express()
const PORT = process.env.PORT || 8000

app.use(express.json())
app.use(cors())

app.listen(PORT, () => {
  console.log(`listening at http://localhost:${PORT}`)
})
