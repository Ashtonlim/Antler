import { Router } from 'express'
import { getUsers, login, register } from './controller'
import { auth } from './middleware'
const router = Router()

router.get('/', auth, getUsers)
router.post('/', auth, register)
router.post('/login', auth, login)

export default router
