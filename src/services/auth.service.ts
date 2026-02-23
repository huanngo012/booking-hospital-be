import jwt from 'jsonwebtoken'
import { BadRequestError, NotFoundError } from '~/core/error.response'
import { UserModel } from '~/models/User'
import { LoginBody, ProfileBody, RegisterBody } from '~/schemas/auth.schema'
import { handleMongoDuplicateError } from '~/utils/helpers'
import { generateAccessToken, generateRefreshToken } from '~/utils/jwt'

const AuthService = {
  register: async (payload: RegisterBody) => {
    try {
      const response = await UserModel.create(payload)
      return response
    } catch (error: unknown) {
      return handleMongoDuplicateError(error, 'Email đã đăng ký')
    }
  },

  login: async (payload: LoginBody) => {
    const { email, password } = payload
    const user = await UserModel.findOne({ email }).select('+password')
    if (!user) throw new BadRequestError('Email không tồn tại')

    const isPasswordValid = await user.isCorrectPassword(password)

    if (!isPasswordValid) throw new BadRequestError('Mật khẩu không chính xác')

    const accessToken = generateAccessToken(user)
    const refreshToken = generateRefreshToken(user)
    user.refreshToken = refreshToken
    await user.save()
    return { accessToken, refreshToken, user }
  },

  logout: async (refreshToken: string) => {
    if (!refreshToken) {
      throw new NotFoundError('Không tìm thấy RefreshToken')
    }
    const user = await UserModel.findOneAndUpdate({ refreshToken }, { $unset: { refreshToken: 1 } }, { new: true })

    if (!user) {
      throw new BadRequestError('RefreshToken không hợp lệ')
    }

    return user
  },

  refreshToken: async (refreshToken: string) => {
    if (!refreshToken) {
      throw new NotFoundError('Không tìm thấy RefreshToken')
    }
    const { _id } = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET as string) as { _id: string }
    const user = await UserModel.findOne({ _id, refreshToken })
    if (!user) {
      throw new NotFoundError('RefreshToken không hợp lệ')
    }
    const newAccessToken = generateAccessToken(user)
    const newRefreshToken = generateRefreshToken(user)
    user.refreshToken = newRefreshToken
    await user.save()
    return { accessToken: newAccessToken, refreshToken: newRefreshToken }
  },

  getCurrentUser: async (_id: string) => {
    const user = await UserModel.findById(_id)
    if (!user) {
      throw new NotFoundError('Người dùng không tồn tại')
    }
    return user
  },

  updateCurrentUser: async (_id: string, payload: ProfileBody) => {
    const user = await UserModel.findById(_id)
    if (!user) {
      throw new NotFoundError('Người dùng không tồn tại')
    }
    const { password, newPassword, avatar } = payload
    if (password && newPassword) {
      const isPasswordValid = await user.isCorrectPassword(password)
      if (!isPasswordValid) {
        throw new BadRequestError('Mật khẩu hiện tại không chính xác')
      }
      payload.password = newPassword
    }
    Object.assign(user, payload)
    await user.save()
    return user
  }
}

export default AuthService
