import { CloudinaryFolder } from '~/constants/enums'
import { NotFoundError } from '~/core/error.response'
import { UserModel } from '~/models/User'
import { User, UserBody, UserQueryParams } from '~/types/user.type'
import { buildAggregateQuery, formatAggregateResult } from '~/utils/buildAggregateQuery'
import { removeVietnameseTones } from '~/utils/helpers'
import ImageService from './image.service'
import { validateEmailUnique } from '~/validations/user.validation'

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

  createUserService: async (payload: UserBody, file?: Express.Multer.File) => {
    await validateEmailUnique(payload.email)
    if (file) payload.avatar = await ImageService.uploadSingle(file, CloudinaryFolder.BOOKINGS_MEDICAL_FACILITY)
    const response = await UserModel.create(payload)
    return response
  },

  updateUserService: async (_id: string, payload: Partial<UserBody>, file?: Express.Multer.File) => {
    const response = await UserModel.findById(_id)
    if (!response) {
      throw new NotFoundError('Người dùng không tồn tại')
    }
    if (file) payload.avatar = await ImageService.uploadSingle(file, CloudinaryFolder.BOOKINGS_MEDICAL_FACILITY)
    Object.assign(response, payload)
    await response.save()
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
