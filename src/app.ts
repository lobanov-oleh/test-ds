import express from 'express'
import expressJwt from 'express-jwt'
import compression from 'compression' // compresses requests
import bodyParser from 'body-parser'
import lusca from 'lusca'
import path from 'path'
import { connect } from '@src/services/mongoose'
import { JWT_SECRET } from '@src/util/secrets'

import tokenRouter from '@routes/tokenRouter'
import playRouter from '@routes/playRouter'
import apiRouter from '@routes/apiRouter'

// Create Express server
const app = express()

const jwtMiddleWare = expressJwt({ secret: JWT_SECRET })

// Connect to DB
connect
  .then(
    () => { /** ready to use. */ }
  )
  .catch((err: string) => {
    console.log('DB connection error. ' + err)
    process.exit()
  })

// Express configuration
app.set('port', typeof process.env.PORT !== 'undefined' ? process.env.PORT : 3000)
app.use(compression())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(lusca.xframe('SAMEORIGIN'))
app.use(lusca.xssProtection(true))

app.use(
  express.static(path.join(__dirname, 'public'), { maxAge: 31557600000 })
)

app.use('/token', tokenRouter)
app.use('/play', playRouter)
app.use('/api', jwtMiddleWare, apiRouter)

export default app
