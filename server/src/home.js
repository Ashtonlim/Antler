import { Router } from 'express'
const router = Router()

router.get('/', () => {
  res.send('Hello World!')
})

export default router
