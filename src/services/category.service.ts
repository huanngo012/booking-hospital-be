import { CategoryModel } from '~/models/Category'
import { removeVietnameseTones } from '~/utils/helpers'
import { NotFoundError } from '~/core/error.response'
import { buildAggregateQuery, formatAggregateResult } from '~/utils/buildAggregateQuery'
import { Category, CategoryBody, CategoryQueryParams } from '~/types/category.type'

const CategoryService = {
  getCategoriesService: async (queries: CategoryQueryParams) => {
    const { limit, sort, page, fields, tag, ...filter } = queries

    const pipeline = buildAggregateQuery({
      filter: {
        deletedAt: null,
        ...filter
      },
      search: {
        ...(tag && { tagNormalized: removeVietnameseTones(tag) })
      },
      sort,
      fields,
      page,
      limit
    })

    const response = await CategoryModel.aggregate(pipeline)
    return formatAggregateResult<Category>(response, page, limit)
  },

  getCategoryBySlugService: async (slug: string) => {
    const response = await CategoryModel.findOne({ slug })
    if (!response) {
      throw new NotFoundError('Danh mục không tồn tại')
    }
    return response
  },

  createCategoryService: async (payload: CategoryBody) => {
    const response = await CategoryModel.create(payload)
    return response
  },

  updateCategoryService: async (_id: string, payload: Partial<CategoryBody>) => {
    const response = await CategoryModel.findById(_id)
    if (!response) {
      throw new NotFoundError('Danh mục không tồn tại')
    }
    Object.assign(response, payload)
    await response.save()
    return response
  },

  deleteCategoryService: async (_id: string) => {
    const response = await CategoryModel.findOneAndUpdate({ _id }, { deletedAt: new Date() }, { new: true })
    if (!response) {
      throw new NotFoundError('Danh mục không tồn tại')
    }
    return response
  }
}

export default CategoryService
