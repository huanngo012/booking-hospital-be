import asyncHandler from 'express-async-handler'
import { Response } from 'express'
import { CategoryBody, CategoryParams, CategoryQuery } from '~/schemas/category.schema'
import CategoryService from '~/services/category.service'
import { CREATED, DELETED, OK } from '~/core/success.response'
import { Category } from '~/types/category.type'

const CategoryController = {
  getCategories: asyncHandler(async (req: QueryRequest<CategoryQuery>, res: Response) => {
    const response = await CategoryService.getCategoriesService(req.query)
    new OK<Category[]>({ data: response }).send(res)
  }),

  getCategory: asyncHandler(async (req: ParamsRequest<CategoryParams>, res: Response) => {
    const response = await CategoryService.getCategoryService(req.params)
    new OK<Category>({ data: response }).send(res)
  }),

  createCategory: asyncHandler(async (req: BodyRequest<CategoryBody>, res: Response) => {
    const response = await CategoryService.createCategoryService(req.body)
    new CREATED<Category>({ data: response }).send(res)
  }),

  updateCategory: asyncHandler(async (req: ParamsBodyRequest<CategoryParams, CategoryBody>, res: Response) => {
    const response = await CategoryService.updateCategoryService(req.params, req.body)
    new OK<Category>({ data: response }).send(res)
  }),

  deleteCategory: asyncHandler(async (req: ParamsRequest<CategoryParams>, res: Response) => {
    await CategoryService.deleteCategoryService(req.params)
    new DELETED().send(res)
  })
}

export default CategoryController
