import jwt from 'jsonwebtoken'
import { AuthFailureError } from '~/core/error.response'
import { User } from '~/types/user.type'

interface IVerifyToken {
  token: string
  secret: string
}
const generateAccessToken = (user: User) =>
  jwt.sign({ _id: user._id, role: user.role, email: user.email }, process.env.ACCESS_TOKEN_SECRET || '', {
    expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN as jwt.SignOptions['expiresIn']
  })

const generateRefreshToken = (user: User) =>
  jwt.sign({ _id: user._id }, process.env.ACCESS_TOKEN_SECRET || '', {
    expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN as jwt.SignOptions['expiresIn']
  })

const verifyToken = ({ token, secret }: IVerifyToken) => {
  try {
    return jwt.verify(token, secret) as User
  } catch (err) {
    throw new AuthFailureError('Token hết hạn hoặc không hợp lệ')
  }
}
export { generateAccessToken, generateRefreshToken, verifyToken }
