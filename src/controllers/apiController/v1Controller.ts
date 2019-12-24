import { Response, Request } from 'express'
import { check, validationResult } from 'express-validator'
import { VideoStatus, Video } from '@models/Video'
import trimmer from '@src/services/trimmer'

interface AuthRequest extends Request {
  user?: any
}

const name = 'v1'

const index = (req: Request, res: Response): object => {
  return res.json({ name })
}

const upload = async (req: AuthRequest, res: Response): Promise<object> => {
  await check('start', 'Invalid start value').isInt({ min: 0 }).run(req)
  await check('end', 'Invalid end value').isInt({ min: 1 }).run(req)

  const errors = validationResult(req)

  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array().map(e => e.msg)
    })
  }

  if (typeof req.file === 'undefined') {
    return res.status(400).json({
      error: 'Video is required'
    })
  }

  const video = new Video({
    userUuid: req.user.uuid,
    filename: req.file.filename,
    originalName: req.file.originalname,
    start: req.body.start,
    end: req.body.end,
    status: VideoStatus.scheduled
  })

  try {
    await video.save()
    trimmer(video.filename)
  } catch (error) {
    return res.status(500).send({ error })
  }

  return res.send({ filename: req.file.filename })
}

const videos = async (req: AuthRequest, res: Response): Promise<object> => {
  try {
    const videos = await Video.find({ userUuid: req.user.uuid })
    return res.send({ videos })
  } catch (error) {
    return res.status(500).send({ error })
  }
}

const restart = async (req: AuthRequest, res: Response): Promise<object> => {
  try {
    const video = await Video.findOne({
      userUuid: req.user.uuid,
      filename: req.params.filename
    })
    if (video !== null) {
      trimmer(video.filename)
      return res.send({ status: 'restarted' })
    } else {
      return res.status(404).send({ error: 'Video not found' })
    }
  } catch (error) {
    return res.status(500).send({ error })
  }
}

export default {
  index,
  upload,
  videos,
  restart
}
