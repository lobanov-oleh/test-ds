import { Router } from 'express'
import tokenController from '@controllers/tokenController'

const router = Router()

router.post('/', tokenController.token)

export default router
