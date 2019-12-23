import { Router } from 'express'
import v1Router from '@routes/apiRouter/v1Router'
import apiController from '@controllers/apiController'

const router = Router()

router.use('/v1', v1Router)

router.get('/', apiController.index)

export default router
