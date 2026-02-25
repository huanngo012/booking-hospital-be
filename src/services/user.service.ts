import { NotFoundError } from '~/core/error.response'
import { UserModel } from '~/models/User'
import { User, UserQueryParams } from '~/types/user.type'
import { removeVietnameseTones } from '~/utils/helpers'

const UserService = {
  getUsersService: async (queries: UserQueryParams) => {
    const { limit, sort, page, fields, name, email, ...filter } = queries
    let filterQuery: Record<string, unknown> = { ...filter }
    if (name) {
      filterQuery = {
        ...filterQuery,
        nameNormalized: {
          $regex: `${removeVietnameseTones(name)}`
        }
      }
    }
    if (email) {
      filterQuery = {
        ...filterQuery,
        email: {
          $regex: `${removeVietnameseTones(email)}`
        }
      }
    }
    let queryCommand = UserModel.find(filterQuery).lean()
    if (sort) {
      queryCommand = queryCommand.sort(sort.split(',').join(' '))
    }
    if (fields) {
      queryCommand = queryCommand.select(fields.split(',').join(' '))
    }
    const pageNumber = Math.max(1, Number(page) || 1)
    const limitNumber = Math.max(1, Number(limit) || Number(process.env.LIMIT) || 10)
    const skip = (pageNumber - 1) * limitNumber
    queryCommand = queryCommand.skip(skip).limit(limitNumber)
    const response = await queryCommand.exec()
    return response
  },

  getUserService: async (_id: string) => {
    const response = await UserModel.findById(_id)
    if (!response) {
      throw new NotFoundError('Người dùng không tồn tại')
    }
    return response
  },

  createUserService: async (payload: User) => {
    const response = await UserModel.create(payload)
    return response
  },

  updateUserService: async (_id: string, payload: User) => {
    const response = await UserModel.findOneAndUpdate({ _id }, payload, { new: true })
    if (!response) {
      throw new NotFoundError('Người dùng không tồn tại')
    }
    return response
  },

  deleteUserService: async (_id: string) => {
    const response = await UserModel.findOneAndUpdate({ _id }, { deletedAt: new Date() }, { new: true })
    if (!response) {
      throw new NotFoundError('Người dùng không tồn tại')
    }
    return response
  }
}

export default UserService
