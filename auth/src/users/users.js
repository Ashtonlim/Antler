import { Router } from 'express'
import { getUsers, login, register, addUserFunds, editUserWatchlist } from './controller'
import { auth } from './middleware'
const router = Router()

router.get('/', getUsers)
router.post('/', register)
router.post('/login', login)
router.post('/addfunds', auth, addUserFunds)
router.post('/editwatchlist', auth, editUserWatchlist)

export default router
