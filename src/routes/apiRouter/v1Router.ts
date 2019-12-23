import { Router } from 'express'
import v1Controller from '@controllers/apiController/v1Controller'

const router: Router = Router()

router.get('/', v1Controller.index)

export default router
