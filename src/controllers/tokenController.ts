import { Response, Request } from 'express'
import jsonwebtoken from 'jsonwebtoken'
import uuidv1 from 'uuid/v1'
import { User } from '@models/User'
import { JWT_SECRET } from '@src/util/secrets'

const parseToken = (uuid: string): string =>
  jsonwebtoken.sign({ uuid }, JWT_SECRET)

const token = (req: Request, res: Response): void => {
  if (typeof req.body.uuid !== 'undefined') {
    const uuid = req.body.uuid

    User.findOne({ uuid }).then(
      existingUser => {
        if (existingUser !== null) {
          res.send({ token: parseToken(uuid) })
        } else {
          res.status(404).send({ error: 'User not found' })
        }
      },
      error => res.status(500).send({ error })
    )
  } else {
    const uuid = uuidv1()
    const user = new User({ uuid })

    user.save().then(
      () => res.send({ uuid, token: parseToken(uuid) }),
      error => res.status(500).send({ error })
    )
  }
}

export default {
  token
}
