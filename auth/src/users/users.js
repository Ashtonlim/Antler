import { Router } from 'express'
import { addUserFunds, editUserWatchlist, getUsers, getUser, follow, unfollow } from './controller'
import { buyStock, sellStock } from './contrUsers_Trade'
import { login, register } from './contrUsers_Auth'
import { auth } from './middleware'
const router = Router()

router.get('/', getUsers)
router.get('/:username', getUser)
router.post('/reg', register)
router.post('/login', login)
router.post('/addfunds', auth, addUserFunds)
router.post('/editwatchlist', auth, editUserWatchlist)
router.post('/follow', auth, follow)
router.post('/unfollow', auth, unfollow)
router.post('/buystock', auth, buyStock)
router.post('/sellstock', auth, sellStock)

export default router
