import { BadRequestError, NotFoundError } from '~/core/error.response'
import { UserModel } from '~/models/User'
import { LoginBody, RegisterBody } from '~/schemas/auth.schema'
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
  }
}

export default AuthService
