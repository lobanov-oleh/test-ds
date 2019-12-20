import { Response, Request, Router } from 'express'

const name: string = 'v1'
const router: Router = Router()

router.use('/', (req: Request, res: Response): object =>
  res.json({ name })
)

export default {
  name,
  router
}
