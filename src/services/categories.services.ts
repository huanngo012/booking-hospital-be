import createError from 'http-errors'
import { CategoryModel } from '~/models/Category'
import { handleMongoDuplicateError, removeVietnameseTones } from '~/utils/helpers'
import { CategoryBody, CategoryParams, CategoryQuery } from '~/validators/category.schema'

export const getCategoriesService = async (queries: CategoryQuery) => {
  const { limit, sort, page, fields, tag, ...filter } = queries

  let filterQuery: Record<string, unknown> = { ...filter }

  if (tag) {
    filterQuery = {
      ...filterQuery,
      tag_normalized: {
        $regex: `^${removeVietnameseTones(tag)}`
      }
    }
  }

  let queryCommand = CategoryModel.find(filterQuery)

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
}

export const getCategoryService = async (_id: CategoryParams) => {
  const response = await CategoryModel.findById(_id)
  return response
}

export const createCategoryService = async (payload: CategoryBody) => {
  try {
    const response = await CategoryModel.create(payload)
    return response
  } catch (error: unknown) {
    handleMongoDuplicateError(error, 'Danh mục đã tồn tại')
  }
}

export const updateCategoryService = async (_id: CategoryParams, payload: CategoryBody) => {
  try {
    const response = await CategoryModel.findOneAndUpdate({ _id }, payload, { new: true })
    if (!response) {
      throw createError(404, 'Danh mục không tồn tại')
    }
    return response
  } catch (error: unknown) {
    handleMongoDuplicateError(error, 'Danh mục đã tồn tại')
  }
}

export const deleteCategoryService = async (_id: CategoryParams) => {
  const response = await CategoryModel.findOneAndUpdate({ _id }, { deletedAt: new Date() }, { new: true })
  if (!response) {
    throw createError(404, 'Danh mục không tồn tại')
  }
  return response
}
