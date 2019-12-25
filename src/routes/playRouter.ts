import { Router } from 'express'
import playController from '@controllers/playController'

const router = Router()

router.get('/:filename', playController)

export default router
