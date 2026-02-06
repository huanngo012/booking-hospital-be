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
