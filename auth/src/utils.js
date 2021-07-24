export const createErrMsg = ({ message = 'Error message from server' } = {}) => {
  return { message }
}

export const verifyAndGetUserId = (req, res, message = 'Unauthenticated, Please logout and log back in') => {
  // specified in middleware.js
  if (!req.verifiedUserId) {
    res.json(createErrMsg({ message }))
    return false
  }
  return req.verifiedUserId
}

// from https://timleland.com/money-in-javascript/
export const dollarsToCents = (val) => {
  val = (val + '').replace(/[^\d.-]/g, '')
  if (val && val.includes('.')) {
    val = val.substring(0, val.indexOf('.') + 3)
  }
  return val ? Math.round(parseFloat(val) * 100) : 0
}

// assumes this currency is 2 d.p., not all are. E.g. JPY = 0 d.p.
export const centsToDollars = (v) => `${v.toString().slice(0, -2)}.${v.toString().slice(-2)}` * 1
