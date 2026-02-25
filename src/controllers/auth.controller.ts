import asyncHandler from 'express-async-handler'
import { Request, Response } from 'express'
import AuthService from '~/services/auth.service'
import { DELETED, OK } from '~/core/success.response'

const AuthController = {
  register: asyncHandler(async (req: Request, res: Response) => {
    const response = await AuthService.register(req.body)
    new OK({ data: response }).send(res)
  }),

  login: asyncHandler(async (req: Request, res: Response) => {
    const { accessToken, refreshToken, user } = await AuthService.login(req.body)
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      secure: true,
      sameSite: 'none'
    })
    res.setHeader('Authorization', `Bearer ${accessToken}`)
    new OK({ data: user }).send(res)
  }),

  logout: asyncHandler(async (req: Request, res: Response) => {
    const token = req.cookies.refreshToken
    await AuthService.logout(token)
    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: true,
      sameSite: 'none'
    })
    new DELETED().send(res)
  }),

  refreshToken: asyncHandler(async (req: Request, res: Response) => {
    const token = req.cookies.refreshToken
    const { accessToken, refreshToken } = await AuthService.refreshToken(token)
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      secure: true,
      sameSite: 'none'
    })
    new OK<{ accessToken: string }>({
      data: { accessToken }
    }).send(res)
  }),

  getCurrentUser: asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?._id.toString() as string
    const response = await AuthService.getCurrentUser(userId)
    new OK({ data: response }).send(res)
  }),

  updateCurrentUser: asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?._id.toString() as string
    const response = await AuthService.updateCurrentUser(userId, req.body)
    new OK({ data: response }).send(res)
  })
}

export default AuthController
