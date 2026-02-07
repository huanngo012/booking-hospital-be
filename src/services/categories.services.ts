import createError from 'http-errors'
import { CategoryModel } from '~/models/Category'
import { handleMongoDuplicateError } from '~/utils/helpers'
import { CategoryBody, CategoryParams } from '~/validations/category.schema'

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
