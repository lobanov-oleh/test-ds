import { Response, Request } from 'express'

const name = 'v1'

const index = (req: Request, res: Response): object =>
  res.json({ name })

export default {
  index
}
