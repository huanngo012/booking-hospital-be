import { NotFoundError } from '~/core/error.response'
import { UserModel } from '~/models/User'
import { User, UserBody, UserQueryParams } from '~/types/user.type'
import { buildAggregateQuery, formatAggregateResult } from '~/utils/buildAggregateQuery'
import { removeVietnameseTones } from '~/utils/helpers'

const UserService = {
  getUsersService: async (queries: UserQueryParams) => {
    const { limit, sort, page, fields, name, email, ...filter } = queries

    const pipeline = buildAggregateQuery({
      filter: {
        deletedAt: null,
        ...filter
      },
      search: {
        ...(name && { nameNormalized: removeVietnameseTones(name) }),
        ...(email && { email: removeVietnameseTones(email) })
      },
      sort,
      fields,
      page,
      limit
    })

    const response = await UserModel.aggregate(pipeline)
    return formatAggregateResult<User>(response, page, limit)
  },

  getUserService: async (_id: string) => {
    const response = await UserModel.findById(_id)
    if (!response) {
      throw new NotFoundError('Người dùng không tồn tại')
    }
    return response
  },

  createUserService: async (payload: UserBody) => {
    const response = await UserModel.create(payload)
    return response
  },

  updateUserService: async (_id: string, payload: Partial<UserBody>) => {
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
