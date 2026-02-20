import asyncHandler from 'express-async-handler'
import { Request, Response } from 'express'
import { LoginBody, RegisterBody } from '~/schemas/auth.schema'
import AuthService from '~/services/auth.service'
import { User } from '~/types/user.type'
import { DELETED, OK } from '~/core/success.response'

const AuthController = {
  register: asyncHandler(async (req: BodyRequest<RegisterBody>, res: Response) => {
    const response = await AuthService.register(req.body)
    new OK<User>({ data: response }).send(res)
  }),
  login: asyncHandler(async (req: BodyRequest<LoginBody>, res: Response) => {
    const response = await AuthService.login(req.body)
    const { accessToken, refreshToken, user } = response
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      secure: true,
      sameSite: 'none'
    })
    res.setHeader('Authorization', `Bearer ${accessToken}`)
    new OK<User>({ data: user }).send(res)
  }),
  logout: asyncHandler(async (req: Request, res: Response) => {
    const refreshToken = req.cookies.refreshToken
    await AuthService.logout(refreshToken)
    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: true,
      sameSite: 'none'
    })
    new DELETED().send(res)
  })
}

export default AuthController
