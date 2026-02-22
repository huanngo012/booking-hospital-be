import { NextFunction, Request, Response } from 'express'
import asyncHandler from 'express-async-handler'
import { AuthFailureError } from '~/core/error.response'
import { verifyToken } from '~/utils/jwt'

export const verifyAccessToken = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization']
  if (!authHeader?.startsWith('Bearer ')) throw new AuthFailureError('Xác thực thất bại!!!')
  const token = authHeader.split(' ')[1]
  if (!token) throw new AuthFailureError('Xác thực thất bại!!!')
  const decoded = verifyToken({ token, secret: process.env.ACCESS_TOKEN_SECRET || '' })
  req.user = decoded
  next()
})
