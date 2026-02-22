import { HydratedDocument } from 'mongoose'
import { BaseDocument } from './base.type'

export interface User extends BaseDocument {
  name: string
  email: string
  password: string
  avatar?: string
  address: string
  role: string
  isBlocked: boolean
  refreshToken?: string
  isVerified: boolean
  emailToken?: string
  emailTokenExpires?: string
  passwordResetToken?: string
  passwordResetExpires?: string
  nameNormalized: string
}
export interface UserMethods {
  isCorrectPassword(password: string): Promise<boolean>
}
export type UserDocument = HydratedDocument<User>
