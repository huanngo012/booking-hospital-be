import { NextFunction, Request, Response } from 'express'
import asyncHandler from 'express-async-handler'
import { AuthFailureError, ForbiddenError } from '~/core/error.response'
import { UserModel } from '~/models/User'
import { verifyToken } from '~/utils/jwt'

export const verifyAccessToken = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization']

  if (!authHeader?.startsWith('Bearer ')) throw new AuthFailureError('Xác thực thất bại!!!')

  const token = authHeader.split(' ')[1]

  if (!token) throw new AuthFailureError('Xác thực thất bại!!!')

  const decoded = verifyToken({ token, secret: process.env.ACCESS_TOKEN_SECRET || '' })

  const user = await UserModel.findById(decoded._id).lean()

  if (!user) throw new AuthFailureError('Tài khoản không tồn tại')

  if (user.isBlocked) throw new ForbiddenError('Tài khoản đã bị khóa')

  req.user = user
  next()
})

export const authorizeRoles = (...allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const userRole = req.user?.role

    if (!userRole || !allowedRoles.includes(userRole)) {
      throw new ForbiddenError('Bạn không có quyền truy cập vào tài nguyên này.')
    }

    next()
  }
}

export default authorizeRoles
