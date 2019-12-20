import mongoose from 'mongoose'

export type UserDocument = mongoose.Document & {
  email: string
  tokens: AuthToken[]
}

export interface AuthToken {
  accessToken: string
  kind: string
}

const userSchema = new mongoose.Schema({
  email: { type: String, unique: true },
  tokens: Array
}, { timestamps: true })

export const User = mongoose.model<UserDocument>('User', userSchema)
