import createError from 'http-errors'
import { CategoryModel } from '~/models/Category'
import { handleMongoDuplicateError } from '~/utils/helpers'

export const createCategoryService = async (tag: string) => {
  try {
    const response = await CategoryModel.create({ tag })
    return response
  } catch (error: unknown) {
    handleMongoDuplicateError(error, 'Danh mục đã tồn tại')
  }
}

export const deleteCategoryService = async (id: string) => {
  const response = await CategoryModel.findOneAndUpdate({ _id: id }, { deletedAt: new Date() }, { new: true })
  if (!response) {
    throw createError(404, 'Danh mục không tồn tại')
  }
  return response
}
