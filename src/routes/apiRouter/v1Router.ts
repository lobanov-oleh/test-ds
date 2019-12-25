import { Router } from 'express'
import v1Controller from '@controllers/apiController/v1Controller'
import multer from 'multer'

const router: Router = Router()

router.get('/', v1Controller.index)

router.get('/videos', v1Controller.videos)
router.get('/videos/:filename/link', v1Controller.videoLink)
router.get('/videos/:filename/restart', v1Controller.restart)

const upload = multer({
  dest: 'uploads/'
})
router.post('/videos/upload', upload.single('video'), v1Controller.upload)

export default router
