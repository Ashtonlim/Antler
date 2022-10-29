import { Router } from 'express'
import { getComments, postComment } from './controller'
import { auth } from '../users/middleware'
const router = Router()

router.get('/comment/:ticker', getComments)
router.post('/comment', auth, postComment)

export default router
