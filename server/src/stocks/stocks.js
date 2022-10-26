import { Router } from 'express'
import { getStock, getStocks } from './controller'
const router = Router()

router.get('/', getStocks)
router.get('/:stock', getStock)
// router.post('/', register)
// router.post('/login', login)

export default router
