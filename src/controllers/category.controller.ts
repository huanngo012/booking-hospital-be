import asyncHandler from 'express-async-handler'
import { Request, Response } from 'express'
import { CREATED, DELETED, OK } from '~/core/success.response'
import CategoryService from '~/services/category.service'

const CategoryController = {
  getCategories: asyncHandler(async (req: Request, res: Response) => {
    const { data, pagination } = await CategoryService.getCategoriesService(req.query)
    new OK({
      data: {
        items: data,
        pagination
      }
    }).send(res)
  }),

  getCategoryBySlug: asyncHandler(async (req: Request, res: Response) => {
    const slug = req.params.slug as string
    const response = await CategoryService.getCategoryBySlugService(slug)
    new OK({ data: response }).send(res)
  }),

  createCategory: asyncHandler(async (req: Request, res: Response) => {
    const response = await CategoryService.createCategoryService(req.body)
    new CREATED({ data: response }).send(res)
  }),

  updateCategory: asyncHandler(async (req: Request, res: Response) => {
    const _id = req.params._id as string
    const response = await CategoryService.updateCategoryService(_id, req.body)
    new OK({ data: response }).send(res)
  }),

  deleteCategory: asyncHandler(async (req: Request, res: Response) => {
    const _id = req.params._id as string
    await CategoryService.deleteCategoryService(_id)
    new DELETED().send(res)
  })
}

export default CategoryController
