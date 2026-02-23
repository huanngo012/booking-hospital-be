import { Response } from 'express'
import asyncHandler from 'express-async-handler'
import { CREATED, DELETED, OK } from '~/core/success.response'
import { UserBody, UserParams, UserQuery } from '~/schemas/user.schema'
import UserService from '~/services/user.service'
import { User } from '~/types/user.type'

const UserController = {
  getUsers: asyncHandler(async (req: QueryRequest<UserQuery>, res: Response) => {
    const response = await UserService.getUsersService(req.query)
    new OK<User[]>({ data: response }).send(res)
  }),

  getUser: asyncHandler(async (req: ParamsRequest<UserParams>, res: Response) => {
    const response = await UserService.getUserService(req.params)
    new OK<User>({ data: response }).send(res)
  }),

  createUser: asyncHandler(async (req: BodyRequest<UserBody>, res: Response) => {
    const response = await UserService.createUserService(req.body)
    new CREATED<User>({ data: response }).send(res)
  }),

  updateUser: asyncHandler(async (req: ParamsBodyRequest<UserParams, UserBody>, res: Response) => {
    const response = await UserService.updateUserService(req.params, req.body)
    new OK<User>({ data: response }).send(res)
  }),

  deleteUser: asyncHandler(async (req: ParamsRequest<UserParams>, res: Response) => {
    await UserService.deleteUserService(req.params)
    new DELETED().send(res)
  })
}

export default UserController
