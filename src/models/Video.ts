import mongoose from 'mongoose'

export enum VideoStatus {
  processing = 'processing',
  scheduled = 'scheduled',
  failed = 'failed',
  done = 'done'
}

export type VideoDocument = mongoose.Document & {
  userUuid: string
  filename: string
  originalName: string
  start: number // milliseconds
  end: number // milliseconds
  status: VideoStatus
}

const videoSchema = new mongoose.Schema({
  userUuid: { type: String },
  filename: { type: String, unique: true },
  originalName: { type: String },
  start: { type: Number },
  end: { type: Number },
  status: { type: VideoStatus }
}, { timestamps: true })

export const Video = mongoose.model<VideoDocument>('Video', videoSchema)
