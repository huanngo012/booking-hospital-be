import { BadRequestError } from '~/core/error.response'
import { CategoryModel } from '~/models/Category'

const validateCategory = async (_id: string) => {
  const categoryExists = await CategoryModel.exists({ _id })
  if (!categoryExists) throw new BadRequestError('Danh mục không tồn tại')
}

export { validateCategory }
