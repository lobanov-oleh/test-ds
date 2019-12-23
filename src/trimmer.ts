import 'module-alias/register'

import Ffmpeg from 'fluent-ffmpeg'
import path from 'path'
import fs from 'fs'
import { connect } from '@src/services/mongoose'
import { VideoStatus, VideoDocument, Video } from '@models/Video'

// Connect to DB
connect
  .then(
    () => { /** ready to use. */ }
  )
  .catch((err: string) => {
    console.log('DB connection error. ' + err)
    process.exit()
  })

const filename: string = process.argv.slice(2)[0]

Video.findOne({ filename }).then(
  existingVideo => {
    if (existingVideo !== null) {
      if (existingVideo.status === VideoStatus.done) {
        console.log('Already done')
        return
      }

      if (existingVideo.status === VideoStatus.processing) {
        console.log('Processing yet')
        return
      }

      try {
        setVideoStatus(existingVideo, VideoStatus.processing)
        trimVideo(existingVideo)
      } catch (error) {
        console.log(error)
      }
    } else {
      console.log('Video not found')
    }
  },
  error => console.log(error)
)

const setVideoStatus = (video: VideoDocument, status: VideoStatus): void => {
  video.status = status
  video.save().then(
    () => console.log('Status: ' + video.status),
    (error) => console.log(error)
  )
}

const trimVideo = (video: VideoDocument): void => {
  const filePath: string = path.join(__dirname, '..', 'uploads', filename)
  const readStream = fs.createReadStream(filePath)
  const writeStream = fs.createWriteStream(filePath + '.trimmed')

  Ffmpeg(readStream)
    .format('m4v')
    .setStartTime(video.start)
    .duration(video.end - video.start)
    .on('error', (error) => {
      console.log(error)
      setVideoStatus(video, VideoStatus.failed)
    })
    .on('end', () => setVideoStatus(video, VideoStatus.done))
    .pipe(writeStream, { end: true })
}
