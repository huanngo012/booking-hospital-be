import { HydratedDocument } from 'mongoose'
import { BaseDocument, QueryParams } from './base.type'

export interface User extends BaseDocument {
  name: string
  email: string
  password: string
  avatar?: string
  address?: string
  role: string
  isBlocked: boolean
  isVerified: boolean
  refreshToken?: string
  emailToken?: string
  emailTokenExpires?: string
  passwordResetToken?: string
  passwordResetExpires?: string
  nameNormalized: string
}

export interface UserMethods {
  isCorrectPassword(password: string): Promise<boolean>
}

export interface UserQueryParams extends QueryParams {
  name?: string
  email?: string
}

export interface UserBody {
  name: string
  email: string
  password: string
  avatar?: string
  address?: string
  role?: string
  isBlocked?: boolean
  isVerified?: boolean
}

export type UserDocument = HydratedDocument<User>
