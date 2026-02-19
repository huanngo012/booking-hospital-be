import { Schema, model } from 'mongoose'
import { RoleCode } from '~/constants/enums'
import { User } from '~/types/user.type'

export const DOCUMENT_NAME = 'User'
export const COLLECTION_NAME = 'users'

const schema = new Schema<User>(
  {
    fullName: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true,
      unique: true
    },
    password: {
      type: String,
      required: true
    },
    avatar: {
      type: String
    },
    address: {
      type: String,
      default: ''
    },
    role: {
      type: String,
      enum: Object.values(RoleCode),
      default: RoleCode.USER
    },
    isBlocked: {
      type: Boolean,
      default: false
    },
    refreshToken: {
      type: String
    },
    isVerified: {
      type: Boolean,
      default: false
    },
    emailToken: {
      type: String
    },
    emailTokenExpires: {
      type: String
    },
    passwordResetToken: {
      type: String
    },
    passwordResetExpires: {
      type: String
    }
  },
  {
    timestamps: true
  }
)

export const UserModel = model<User>(DOCUMENT_NAME, schema, COLLECTION_NAME)
