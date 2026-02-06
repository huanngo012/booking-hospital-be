import createError from 'http-errors'
import { CategoryModel } from '~/models/Category'

export const createCategoryService = async (tag: string) => {
  const cleanTag = String(tag).trim()
  if (!cleanTag) {
    throw createError(400, 'Vui lòng nhập đầy đủ')
  }
  const existed = await CategoryModel.findOne({ tag: cleanTag })
  if (existed) {
    throw createError(409, 'Danh mục đã tồn tại')
  }

  const response = await CategoryModel.create({ tag: cleanTag })
  return response
}
