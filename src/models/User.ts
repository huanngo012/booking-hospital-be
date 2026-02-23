import { Query, Schema, model } from 'mongoose'
import bcryptjs from 'bcryptjs'
import { RoleCode } from '~/constants/enums'
import { User, UserDocument, UserMethods } from '~/types/user.type'
import { removeVietnameseTones } from '~/utils/helpers'
import { Model } from 'mongoose'

export const DOCUMENT_NAME = 'User'
export const COLLECTION_NAME = 'users'

const schema = new Schema<User, Model<User, unknown, UserMethods>>(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      trim: true
    },
    password: {
      type: String,
      required: true,
      select: false
    },
    avatar: {
      type: String,
      default: ''
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
    isVerified: {
      type: Boolean,
      default: false
    },
    isBlocked: {
      type: Boolean,
      default: false
    },
    refreshToken: {
      type: String,
      select: false
    },
    emailToken: {
      type: String,
      select: false
    },
    emailTokenExpires: {
      type: String,
      select: false
    },
    passwordResetToken: {
      type: String,
      select: false
    },
    passwordResetExpires: {
      type: String,
      select: false
    },
    nameNormalized: {
      type: String,
      trim: true,
      select: false
    },
    deletedAt: {
      type: Date,
      default: null,
      select: false
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
)

schema.pre(/^find/, function (this: Query<User, User>) {
  this.where({ deletedAt: null })
})

schema.pre('save', async function (this: UserDocument) {
  if (this.isModified('name')) {
    this.nameNormalized = removeVietnameseTones(this.name)
  }

  if (this.isModified('password')) {
    const salt = bcryptjs.genSaltSync(10)
    this.password = await bcryptjs.hash(this.password, salt)
  }
})

schema.methods = {
  isCorrectPassword: async function (password: string) {
    return await bcryptjs.compare(password, this.password)
  }
}
schema.set('toJSON', {
  transform: function (_doc, ret) {
    const {
      password,
      refreshToken,
      emailToken,
      emailTokenExpires,
      passwordResetToken,
      passwordResetExpires,
      nameNormalized,
      deletedAt,
      ...safeData
    } = ret
    return safeData
  }
})
schema.index({ deletedAt: 1 })
schema.index({ email: 1 }, { unique: true, partialFilterExpression: { deletedAt: null } })

export const UserModel = model<User, Model<User, unknown, UserMethods>>(DOCUMENT_NAME, schema, COLLECTION_NAME)
