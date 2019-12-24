import 'module-alias/register'

import Ffmpeg from 'fluent-ffmpeg'
import path from 'path'
import fs from 'fs'
import { connect } from '@src/services/mongoose'
import { VideoStatus, VideoDocument, Video } from '@models/Video'

const exit = (message?: string): void => {
  if (typeof message !== 'undefined') {
    console.log(message)
  }

  process.exit()
}

// Connect to DB
connect
  .then(() => { /** DB is ready to use */ })
  .catch((err: string) => exit('DB connection error. ' + err))

const filename: string = process.argv.slice(2)[0]

Video.findOne({ filename }).then(
  existingVideo => {
    if (existingVideo !== null) {
      console.log('Video exists')

      if (existingVideo.status === VideoStatus.done) {
        exit('Already done')
      }

      if (existingVideo.status === VideoStatus.processing) {
        exit('Processing yet')
      }

      try {
        setVideoStatus(existingVideo, VideoStatus.processing)
          .then(
            () => trimVideo(existingVideo),
            error => exit(error)
          )
      } catch (error) {
        exit(error)
      }
    } else {
      exit('Video not found')
    }
  },
  error => exit(error)
)

const setVideoStatus = async (video: VideoDocument, status: VideoStatus): Promise<void> => {
  video.status = status
  return video.save().then(
    () => console.log('New status: ' + video.status),
    (error) => console.log(error)
  )
}

const trimVideo = (video: VideoDocument): void => {
  const filePath: string = path.join(__dirname, '..', 'uploads', filename)

  Ffmpeg(filePath)
    .preset('divx')
    .setStartTime(video.start)
    .setDuration(video.end - video.start)
    .on('start', (commandLine: string) => {
      console.log('Spawned FFmpeg with command: ' + commandLine)
    })
    .on('error', (error) => {
      setVideoStatus(video, VideoStatus.failed).then(
        () => exit(error),
        () => exit(error)
      )
    })
    .on('end', () => {
      setVideoStatus(video, VideoStatus.done).then(
        () => fs.rename(
          filePath + '.trimmed',
          filePath,
          () => exit()
        )
        ,
        () => exit()
      )
    })
    .saveToFile(filePath + '.trimmed')
}
