import { Response, Request } from 'express'

const versions = [
  'v1'
]

const index = (req: Request, res: Response): object =>
  res.json({ versions })

export default {
  index
}
