import { Response, Request } from 'express'
import jsonwebtoken from 'jsonwebtoken'
import uuidv1 from 'uuid/v1'
import { User } from '@models/User'
import { JWT_SECRET } from '@src/util/secrets'

const sendToken = (res: Response, uuid: string): void => {
  const user = { uuid }
  const token = jsonwebtoken.sign(user, JWT_SECRET)

  res.send({
    uuid,
    token
  })
}

export const token = (req: Request, res: Response): void => {
  if (typeof req.body.uuid !== 'undefined') {
    const uuid = req.body.uuid

    User.findOne({ uuid }, (error, existingUser) => {
      if (error !== null) {
        res.status(500).send({ error })
      } else if (existingUser !== null) {
        sendToken(res, uuid)
      } else {
        res.status(404).send({ error: 'User not found' })
      }
    })
  } else {
    const uuid = uuidv1()
    const user = new User({ uuid })

    user.save((error) => {
      if (error !== null) {
        res.status(500).send({ error })
      } else {
        sendToken(res, uuid)
      }
    })
  }
}
