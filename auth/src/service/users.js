import { Router } from 'express'
import { getUsers, login, register } from './controller'
const router = Router()

router.get('/', getUsers)
router.post('/', register)
router.post('/login', login)

export default router
