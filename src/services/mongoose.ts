import mongoose from 'mongoose'
import bluebird from 'bluebird'
import { MONGODB_URI } from '@src/util/secrets'

// Connect to MongoDB
const mongoUrl = MONGODB_URI
mongoose.Promise = bluebird

export const connect = mongoose.connect(mongoUrl, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true })
