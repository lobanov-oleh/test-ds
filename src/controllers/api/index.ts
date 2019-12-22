import { Response, Request, Router } from 'express'
import v1 from '@api/v1'

const router = Router()
const versions: Array<{ name: string, router: Router }> = [
  v1
]

for (const version of versions) {
  router.use('/' + version.name, version.router)
}

router.use('/', (req: Request, res: Response): object =>
  res.json({
    versions: versions.map(v => v.name)
  })
)

export default router
