import jwt from 'jsonwebtoken'

const auth = async (req, res, next) => {
    try {
        console.log(req.headers)
        // const token = req.headers.authorization
    } catch (err) {
        console.log({ err, msg: err.message })
    }
}
