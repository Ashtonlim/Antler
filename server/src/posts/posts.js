import { Router } from 'express'
import { getPosts, createPost } from './controller'
import { auth } from '../users/middleware'
const router = Router()

router.get('/:ticker', getPosts)
router.post('/createPost', auth, createPost)

export default router
