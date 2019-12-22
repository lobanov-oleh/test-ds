import mongoose from 'mongoose'

export type UserDocument = mongoose.Document & {
  uuid: string
}

const userSchema = new mongoose.Schema({
  uuid: { type: String, unique: true }
}, { timestamps: true })

export const User = mongoose.model<UserDocument>('User', userSchema)
