// import stocks from './stocks.json'
require('dotenv').config()

const stocks = require('./stocks.json')

mongoose
  .connect(process.env.MONGOAPIKEY, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log(stocks)
  })
  .catch((err) => console.log(err))
