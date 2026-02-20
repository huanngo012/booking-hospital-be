import createError from 'http-errors'
import { SpecialtyModel } from '~/models/Specialty'
import { SpecialtyBody, SpecialtyParams, SpecialtyQuery } from '~/schemas/specialty.schema'
import { handleMongoDuplicateError, removeVietnameseTones } from '~/utils/helpers'

const SpecialtyService = {
  getSpecialiesService: async (queries: SpecialtyQuery) => {
    const { limit, sort, page, fields, name, ...filter } = queries
    let filterQuery: Record<string, unknown> = { ...filter }
    if (name) {
      filterQuery = {
        ...filterQuery,
        nameNormalized: {
          $regex: `^${removeVietnameseTones(name)}`
        }
      }
    }
    let queryCommand = SpecialtyModel.find(filterQuery)
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

  getSpecialtyService: async (_id: SpecialtyParams) => {
    const response = await SpecialtyModel.findById(_id)
    if (!response) {
      throw createError(404, 'Danh mục không tồn tại')
    }
    return response
  },

  createSpecialtyService: async (payload: SpecialtyBody) => {
    try {
      const response = await SpecialtyModel.create(payload)
      return response
    } catch (error: unknown) {
      return handleMongoDuplicateError(error, 'Chuyên khoa đã tồn tại')
    }
  },

  updateSpecialtyService: async (_id: SpecialtyParams, payload: SpecialtyBody) => {
    try {
      const response = await SpecialtyModel.findOneAndUpdate({ _id }, payload, { new: true })
      if (!response) {
        throw createError(404, 'Chuyên khoa không tồn tại')
      }
      return response
    } catch (error: unknown) {
      return handleMongoDuplicateError(error, 'Chuyên khoa đã tồn tại')
    }
  },

  deleteSpecialtyService: async (_id: SpecialtyParams) => {
    const response = await SpecialtyModel.findOneAndUpdate({ _id }, { deletedAt: new Date() }, { new: true })
    if (!response) {
      throw createError(404, 'Chuyên khoa không tồn tại')
    }
    return response
  }
}

export default SpecialtyService
