import { Request, Response } from 'express'
import asyncHandler from 'express-async-handler'
import { CREATED, DELETED, OK } from '~/core/success.response'
import UserService from '~/services/user.service'

const UserController = {
  getUsers: asyncHandler(async (req: Request, res: Response) => {
    const response = await UserService.getUsersService(req.query)
    new OK({ data: response }).send(res)
  }),

  getUser: asyncHandler(async (req: Request, res: Response) => {
    const _id = req.params._id as string
    const response = await UserService.getUserService(_id)
    new OK({ data: response }).send(res)
  }),

  createUser: asyncHandler(async (req: Request, res: Response) => {
    const response = await UserService.createUserService(req.body)
    new CREATED({ data: response }).send(res)
  }),

  updateUser: asyncHandler(async (req: Request, res: Response) => {
    const _id = req.params._id as string
    const response = await UserService.updateUserService(_id, req.body)
    new OK({ data: response }).send(res)
  }),

  deleteUser: asyncHandler(async (req: Request, res: Response) => {
    const _id = req.params._id as string
    await UserService.deleteUserService(_id)
    new DELETED().send(res)
  })
}

export default UserController
