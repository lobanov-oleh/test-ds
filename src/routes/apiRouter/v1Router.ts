import { Router } from 'express'
import v1Controller from '@controllers/apiController/v1Controller'
import multer from 'multer'

const router: Router = Router()

router.get('/', v1Controller.index)

const upload = multer({
  dest: 'uploads/'
})
router.post('/upload', upload.single('video'), v1Controller.upload)

router.get('/videos', v1Controller.videos)

export default router
