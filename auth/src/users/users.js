import { Router } from 'express'
import { getUsers, login, register, updateUserDetails } from './controller'
import { auth } from './middleware'
const router = Router()

router.get('/', getUsers)
router.post('/', register)
router.post('/login', login)
router.post('/addfunds', auth, updateUserDetails)

export default router
