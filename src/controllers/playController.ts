import { Request, Response } from 'express'
import fs from 'fs'
import path from 'path'

export default (req: Request, res: Response): void => {
  const filePath: string = path.join(
    __dirname,
    '..',
    '..',
    'uploads',
    req.params.filename
  )
  const stat = fs.statSync(filePath)
  const fileSize = stat.size
  const range = req.headers.range

  if (typeof range !== 'undefined' && range !== '') {
    const parts: string[] = range.replace(/bytes=/, '').split('-')
    const start = parseInt(parts[0], 10)
    const end = typeof parts[1] !== 'undefined' && parts[1] !== ''
      ? parseInt(parts[1], 10)
      : fileSize - 1
    const chunksize = (end - start) + 1
    const file = fs.createReadStream(filePath, { start, end })
    const head = {
      'Content-Range': `bytes ${start}-${end}/${fileSize}`,
      'Accept-Ranges': 'bytes',
      'Content-Length': chunksize,
      'Content-Type': 'video/mp4'
    }

    res.writeHead(206, head)
    file.pipe(res)
  } else {
    const head = {
      'Content-Length': fileSize,
      'Content-Type': 'video/mp4'
    }

    res.writeHead(200, head)
    fs.createReadStream(filePath).pipe(res)
  }
}
