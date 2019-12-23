import express from 'express'
import expressJwt from 'express-jwt'
import compression from 'compression' // compresses requests
import bodyParser from 'body-parser'
import lusca from 'lusca'
import path from 'path'
import mongoose from 'mongoose'
import bluebird from 'bluebird'
import { MONGODB_URI, JWT_SECRET } from '@src/util/secrets'

import tokenRouter from '@routes/tokenRouter'
import apiRouter from '@routes/apiRouter'

// Create Express server
const app = express()

const jwtMiddleWare = expressJwt({ secret: JWT_SECRET })

// Connect to MongoDB
const mongoUrl = MONGODB_URI
mongoose.Promise = bluebird

mongoose.connect(mongoUrl, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true }).then(
  () => { /** ready to use. The `mongoose.connect()` promise resolves to undefined. */ }
).catch((err: string) => {
  console.log('MongoDB connection error. Please make sure MongoDB is running. ' + err)
  // process.exit();
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
app.use('/api', jwtMiddleWare, apiRouter)

export default app
